package billing

import (
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

func SyncCancelHandler(e *core.RequestEvent) error {
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
		Status:   stripe.String("all"),
	}
	params.Limit = stripe.Int64(1)
	iter := stripesubscription.List(params)
	plan := "free"
	subID := user.GetString("subscription_id")
	subStatus := "canceled"
	var cancelAt string
	if iter.Next() {
		sub := iter.Subscription()
		subID = sub.ID
		subStatus = string(sub.Status)
		if sub.CancelAt > 0 {
			cancelAt = time.Unix(sub.CancelAt, 0).UTC().Format(time.RFC3339)
			subStatus = "canceled"
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
