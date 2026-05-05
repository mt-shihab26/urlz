package billing

import (
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	"github.com/stripe/stripe-go/v85/checkout/session"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

type syncBody struct {
	SessionID string `json:"session_id"`
}

func SyncHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	var body syncBody
	if err := e.BindBody(&body); err != nil || body.SessionID == "" {
		return apis.NewBadRequestError("missing session_id", nil)
	}

	s, err := session.Get(body.SessionID, &stripe.CheckoutSessionParams{
		Expand: []*string{stripe.String("subscription")},
	})
	if err != nil {
		return apis.NewBadRequestError("failed to fetch session: "+err.Error(), nil)
	}

	if s.Metadata["user_id"] != user.Id {
		return apis.NewForbiddenError("session does not belong to this user", nil)
	}

	plan := s.Metadata["plan"]
	if plan == "" {
		plan = "pro"
	}

	if s.Subscription == nil {
		return apis.NewBadRequestError("no subscription found on session", nil)
	}
	subID := s.Subscription.ID
	subStatus := string(s.Subscription.Status)

	var cancelAt string
	if s.Subscription.CancelAt > 0 {
		cancelAt = time.Unix(s.Subscription.CancelAt, 0).UTC().Format(time.RFC3339)
	}

	user.Set("plan", plan)
	user.Set("subscription_id", subID)
	user.Set("subscription_status", subStatus)
	user.Set("subscription_cancel_at", cancelAt)
	if err := e.App.Save(user); err != nil {
		return apis.NewBadRequestError("failed to update user", err)
	}

	return e.JSON(200, map[string]any{"ok": true})
}

// SyncPortalHandler refreshes subscription status after the user returns
// from the Stripe billing portal (e.g. after canceling).
func SyncPortalHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	customerID := user.GetString("stripe_customer_id")
	if customerID == "" {
		return e.JSON(200, map[string]any{"ok": true})
	}

	// List all statuses so we can see canceled subs too
	params := &stripe.SubscriptionListParams{
		Customer: stripe.String(customerID),
		Status:   stripe.String("all"),
	}
	params.Limit = stripe.Int64(1)

	iter := stripesubscription.List(params)

	plan := "free"
	subID := user.GetString("subscription_id") // preserve existing if none found
	subStatus := "canceled"
	var cancelAt string

	if iter.Next() {
		sub := iter.Subscription()
		subID = sub.ID
		subStatus = string(sub.Status)
		if sub.CancelAt > 0 {
			cancelAt = time.Unix(sub.CancelAt, 0).UTC().Format(time.RFC3339)
		}
		if sub.Status == stripe.SubscriptionStatusActive || sub.Status == stripe.SubscriptionStatusTrialing {
			plan = sub.Metadata["plan"]
			if plan == "" {
				plan = "pro"
			}
		}
	}

	user.Set("plan", plan)
	user.Set("subscription_id", subID)
	user.Set("subscription_status", subStatus)
	user.Set("subscription_cancel_at", cancelAt)
	if err := e.App.Save(user); err != nil {
		return apis.NewBadRequestError("failed to update user", err)
	}

	return e.JSON(200, map[string]any{"ok": true})
}
