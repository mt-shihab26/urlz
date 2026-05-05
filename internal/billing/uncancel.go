package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

func UncancelHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	subscriptionID := user.GetString("subscription_id")
	if subscriptionID == "" {
		return apis.NewBadRequestError("no subscription found", nil)
	}
	sub, err := stripesubscription.Get(subscriptionID, nil)
	if err != nil {
		return apis.NewBadRequestError("failed to fetch subscription", err)
	}
	if sub.Status == stripe.SubscriptionStatusCanceled {
		return apis.NewBadRequestError("subscription is already canceled", nil)
	}
	if !sub.CancelAtPeriodEnd && sub.CancelAt == 0 {
		return apis.NewBadRequestError("subscription is not scheduled for cancellation", nil)
	}
	var params *stripe.SubscriptionParams
	if sub.CancelAt != 0 {
		params = &stripe.SubscriptionParams{}
		params.AddExtra("cancel_at", "")
	} else {
		params = &stripe.SubscriptionParams{
			CancelAtPeriodEnd: new(false),
		}
	}
	if _, err := stripesubscription.Update(subscriptionID, params); err != nil {
		return apis.NewBadRequestError("failed to reactivate subscription", err)
	}
	user.Set("subscription_cancel_at", "")
	if err := e.App.Save(user); err != nil {
		return apis.NewBadRequestError("failed to update user", err)
	}
	return e.JSON(200, map[string]any{"ok": true})
}
