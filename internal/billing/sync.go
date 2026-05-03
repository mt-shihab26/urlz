package billing

import (
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

	if s.Metadata["pb_user_id"] != user.Id {
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

	user.Set("plan", plan)
	user.Set("subscription_id", subID)
	user.Set("subscription_status", subStatus)
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

	params := &stripe.SubscriptionListParams{
		Customer: stripe.String(customerID),
	}
	params.Limit = stripe.Int64(1)
	params.AddExpand("data.plan.product")

	iter := stripesubscription.List(params)

	plan := "free"
	subID := ""
	subStatus := "canceled"

	if iter.Next() {
		sub := iter.Subscription()
		subID = sub.ID
		subStatus = string(sub.Status)
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
	if err := e.App.Save(user); err != nil {
		return apis.NewBadRequestError("failed to update user", err)
	}

	return e.JSON(200, map[string]any{"ok": true})
}
