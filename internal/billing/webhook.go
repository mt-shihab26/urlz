package billing

import (
	"encoding/json"
	"io"
	"os"

	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	"github.com/stripe/stripe-go/v85/webhook"
)

func WebhookHandler(e *core.RequestEvent) error {
	payload, err := io.ReadAll(e.Request.Body)
	if err != nil {
		return e.JSON(400, map[string]any{"error": "failed to read body"})
	}

	sig := e.Request.Header.Get("Stripe-Signature")
	event, err := webhook.ConstructEvent(payload, sig, os.Getenv("STRIPE_WEBHOOK_SECRET"))
	if err != nil {
		return e.JSON(400, map[string]any{"error": "invalid signature"})
	}

	switch event.Type {
	case "checkout.session.completed":
		var s stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &s); err == nil {
			onCheckoutCompleted(e.App, &s)
		}
	case "customer.subscription.updated":
		var sub stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &sub); err == nil {
			onSubscriptionUpdated(e.App, &sub)
		}
	case "customer.subscription.deleted":
		var sub stripe.Subscription
		if err := json.Unmarshal(event.Data.Raw, &sub); err == nil {
			onSubscriptionDeleted(e.App, &sub)
		}
	}

	return e.JSON(200, map[string]any{"received": true})
}

func onCheckoutCompleted(app core.App, s *stripe.CheckoutSession) {
	userID := s.Metadata["pb_user_id"]
	if userID == "" {
		return
	}
	user, err := app.FindRecordById("users", userID)
	if err != nil {
		return
	}
	subID := ""
	plan := s.Metadata["plan"]
	if plan == "" {
		plan = "pro"
	}
	if s.Subscription != nil {
		subID = s.Subscription.ID
	}
	user.Set("plan", plan)
	user.Set("subscription_id", subID)
	user.Set("subscription_status", "active")
	app.Save(user) //nolint
}

func onSubscriptionUpdated(app core.App, sub *stripe.Subscription) {
	userID := sub.Metadata["pb_user_id"]
	if userID == "" {
		return
	}
	user, err := app.FindRecordById("users", userID)
	if err != nil {
		return
	}
	plan := "free"
	if sub.Status == stripe.SubscriptionStatusActive || sub.Status == stripe.SubscriptionStatusTrialing {
		plan = sub.Metadata["plan"]
		if plan == "" {
			plan = "pro"
		}
	}
	user.Set("plan", plan)
	user.Set("subscription_status", string(sub.Status))
	app.Save(user) //nolint
}

func onSubscriptionDeleted(app core.App, sub *stripe.Subscription) {
	userID := sub.Metadata["pb_user_id"]
	if userID == "" {
		return
	}
	user, err := app.FindRecordById("users", userID)
	if err != nil {
		return
	}
	user.Set("plan", "free")
	user.Set("subscription_id", "")
	user.Set("subscription_status", "canceled")
	app.Save(user) //nolint
}
