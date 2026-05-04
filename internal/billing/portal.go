package billing

import (
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	portalsession "github.com/stripe/stripe-go/v85/billingportal/session"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

func PortalHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	customerID := user.GetString("stripe_customer_id")
	if customerID == "" {
		return apis.NewBadRequestError("no active subscription", nil)
	}

	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:5173"
	}

	s, err := portalsession.New(&stripe.BillingPortalSessionParams{
		Customer:  stripe.String(customerID),
		ReturnURL: stripe.String(appURL + "/dashboard/billing?portal_return=1"),
	})
	if err != nil {
		return apis.NewBadRequestError("failed to create portal session", err)
	}

	return e.JSON(200, map[string]any{"url": s.URL})
}

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

func CancelFlowHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	customerID := user.GetString("stripe_customer_id")
	if customerID == "" {
		return apis.NewBadRequestError("no active subscription", nil)
	}

	subscriptionID := user.GetString("subscription_id")
	if subscriptionID == "" {
		return apis.NewBadRequestError("no subscription found", nil)
	}

	// Verify subscription is still cancellable before creating flow
	sub, err := stripesubscription.Get(subscriptionID, nil)
	if err != nil {
		return apis.NewBadRequestError("failed to fetch subscription", nil)
	}
	if sub.Status == stripe.SubscriptionStatusCanceled {
		return apis.NewBadRequestError("subscription is already canceled", nil)
	}
	if sub.CancelAtPeriodEnd {
		return apis.NewBadRequestError("subscription is already scheduled for cancellation", nil)
	}

	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:5173"
	}

	returnURL := appURL + "/dashboard/billing?portal_return=1"

	s, err := portalsession.New(&stripe.BillingPortalSessionParams{
		Customer:  stripe.String(customerID),
		ReturnURL: stripe.String(returnURL),
		FlowData: &stripe.BillingPortalSessionFlowDataParams{
			Type: stripe.String("subscription_cancel"),
			SubscriptionCancel: &stripe.BillingPortalSessionFlowDataSubscriptionCancelParams{
				Subscription: stripe.String(subscriptionID),
			},
			AfterCompletion: &stripe.BillingPortalSessionFlowDataAfterCompletionParams{
				Type: stripe.String("redirect"),
				Redirect: &stripe.BillingPortalSessionFlowDataAfterCompletionRedirectParams{
					ReturnURL: stripe.String(returnURL),
				},
			},
		},
	})
	if err != nil {
		return apis.NewBadRequestError("failed to create cancel flow session", err)
	}

	return e.JSON(200, map[string]any{"url": s.URL})
}
