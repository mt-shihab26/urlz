package billing

import (
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	portalsession "github.com/stripe/stripe-go/v85/billingportal/session"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

func CancelHandler(e *core.RequestEvent) error {
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
		return apis.NewBadRequestError("APP_URL not configured", nil)
	}
	returnURL := appURL + "/dashboard/billing?cancel=1"
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
