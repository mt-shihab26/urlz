package billing

import (
	"encoding/json"
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	"github.com/stripe/stripe-go/v85/checkout/session"
	"github.com/stripe/stripe-go/v85/customer"
)

type checkoutBody struct {
	Plan string `json:"plan"`
}

func CheckoutHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	var body checkoutBody
	if err := json.NewDecoder(e.Request.Body).Decode(&body); err != nil || body.Plan == "" {
		body.Plan = "pro"
	}

	priceID := ""
	switch body.Plan {
	case "business":
		priceID = os.Getenv("STRIPE_BUSINESS_PRICE_ID")
	default:
		body.Plan = "pro"
		priceID = os.Getenv("STRIPE_PRO_PRICE_ID")
	}
	if priceID == "" {
		return apis.NewBadRequestError("price not configured for plan: "+body.Plan, nil)
	}

	customerID := user.GetString("stripe_customer_id")
	if customerID == "" {
		c, err := customer.New(&stripe.CustomerParams{
			Email: stripe.String(user.GetString("email")),
			Name:  stripe.String(user.GetString("name")),
			Metadata: map[string]string{
				"pb_user_id": user.Id,
			},
		})
		if err != nil {
			return apis.NewBadRequestError("failed to create billing customer", err)
		}
		customerID = c.ID
		user.Set("stripe_customer_id", customerID)
		if err := e.App.Save(user); err != nil {
			return apis.NewBadRequestError("failed to save customer", err)
		}
	}

	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:5173"
	}

	s, err := session.New(&stripe.CheckoutSessionParams{
		Customer: stripe.String(customerID),
		Mode:     stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(appURL + "/dashboard/billing?success=1"),
		CancelURL:  stripe.String(appURL + "/dashboard/billing"),
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			Metadata: map[string]string{
				"pb_user_id": user.Id,
				"plan":       body.Plan,
			},
		},
	})
	if err != nil {
		return apis.NewBadRequestError("failed to create checkout session", err)
	}

	return e.JSON(200, map[string]any{"url": s.URL})
}
