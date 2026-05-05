package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

// CancelFlowHandler creates a portal session scoped to the subscription_cancel
// flow with after_completion.type=redirect so Stripe auto-redirects back to
// the app after the user confirms cancellation — no manual "Back" click needed.
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
		return apis.NewBadRequestError("failed to fetch subscription", nil)
	}
	if !sub.CancelAtPeriodEnd && sub.CancelAt == 0 {
		return apis.NewBadRequestError("subscription is not scheduled for cancellation", nil)
	}

	params := &stripe.SubscriptionParams{
		CancelAtPeriodEnd: stripe.Bool(false),
	}
	if sub.CancelAt != 0 {
		params.AddExtra("cancel_at", "")
	}
	if _, err := stripesubscription.Update(subscriptionID, params); err != nil {
		return apis.NewBadRequestError("failed to reactivate subscription: "+err.Error(), nil)
	}

	return e.JSON(200, map[string]any{"ok": true})
}
