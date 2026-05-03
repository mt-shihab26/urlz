package billing

import (
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	portalsession "github.com/stripe/stripe-go/v85/billingportal/session"
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
		ReturnURL: stripe.String(appURL + "/dashboard/billing"),
	})
	if err != nil {
		return apis.NewBadRequestError("failed to create portal session", err)
	}

	return e.JSON(200, map[string]any{"url": s.URL})
}
