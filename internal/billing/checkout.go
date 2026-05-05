package billing

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	stripe "github.com/stripe/stripe-go/v85"
	stripesession "github.com/stripe/stripe-go/v85/checkout/session"
	stripecustomer "github.com/stripe/stripe-go/v85/customer"
	stripeprice "github.com/stripe/stripe-go/v85/price"
)

func CheckoutHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	var body struct {
		Plan string `json:"plan"`
	}
	if err := json.NewDecoder(e.Request.Body).Decode(&body); err != nil || body.Plan == "" {
		body.Plan = "pro"
	}
	productID := ""
	switch body.Plan {
	case "business":
		productID = os.Getenv("STRIPE_BUSINESS_PRODUCT_ID")
	default:
		body.Plan = "pro"
		productID = os.Getenv("STRIPE_PRO_PRODUCT_ID")
	}
	if productID == "" {
		return apis.NewBadRequestError("product not configured for plan: "+body.Plan, nil)
	}
	if user.GetString("plan") == body.Plan {
		return apis.NewBadRequestError("already on this plan", nil)
	}
	priceID, err := priceIDForProduct(productID)
	if err != nil {
		return apis.NewBadRequestError("failed to resolve price: "+err.Error(), nil)
	}
	customerID := user.GetString("stripe_customer_id")
	if customerID == "" {
		c, err := stripecustomer.New(&stripe.CustomerParams{
			Email:    stripe.String(user.GetString("email")),
			Name:     stripe.String(user.GetString("name")),
			Metadata: map[string]string{"user_id": user.Id},
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
		return apis.NewBadRequestError("APP_URL not configured", nil)
	}
	params := &stripe.CheckoutSessionParams{
		Customer: stripe.String(customerID),
		Mode:     stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		Metadata: map[string]string{
			"user_id": user.Id,
			"plan":    body.Plan,
		},
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(appURL + "/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(appURL + "/dashboard/billing?cancel=1"),
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			Metadata: map[string]string{
				"user_id": user.Id,
				"plan":    body.Plan,
			},
		},
	}
	s, err := stripesession.New(params)
	if err != nil {
		return apis.NewBadRequestError("failed to create checkout session", err)
	}
	return e.JSON(200, map[string]any{"url": s.URL})
}

func priceIDForProduct(productID string) (string, error) {
	params := &stripe.PriceListParams{
		Product: stripe.String(productID),
		Active:  new(true),
	}
	params.Limit = stripe.Int64(1)
	i := stripeprice.List(params)
	if i.Next() {
		return i.Price().ID, nil
	}
	if err := i.Err(); err != nil {
		return "", err
	}
	return "", fmt.Errorf("no active price found for product %s", productID)
}
