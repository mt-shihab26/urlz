package billing

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	"github.com/stripe/stripe-go/v85/checkout/session"
	"github.com/stripe/stripe-go/v85/customer"
	"github.com/stripe/stripe-go/v85/price"
)

type checkoutBody struct {
	Plan   string `json:"plan"`
	Coupon string `json:"coupon"`
}

func priceIDForProduct(productID string) (string, error) {
	params := &stripe.PriceListParams{
		Product: stripe.String(productID),
		Active:  stripe.Bool(true),
	}
	params.Limit = stripe.Int64(1)
	i := price.List(params)
	if i.Next() {
		return i.Price().ID, nil
	}
	if err := i.Err(); err != nil {
		return "", err
	}
	return "", fmt.Errorf("no active price found for product %s", productID)
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

	// Resolve coupon code → Stripe coupon ID via PocketBase coupons collection
	var discounts []*stripe.CheckoutSessionDiscountParams
	if body.Coupon != "" {
		coupon, err := e.App.FindFirstRecordByFilter(
			"coupons",
			"code = {:code} && active = true",
			map[string]any{"code": body.Coupon},
		)
		if err != nil {
			return apis.NewBadRequestError("invalid or inactive coupon code", nil)
		}
		discounts = []*stripe.CheckoutSessionDiscountParams{
			{Coupon: stripe.String(coupon.GetString("stripe_coupon_id"))},
		}
	}

	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:5173"
	}

	params := &stripe.CheckoutSessionParams{
		Customer: stripe.String(customerID),
		Mode:     stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		Metadata: map[string]string{
			"pb_user_id": user.Id,
			"plan":       body.Plan,
		},
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		SuccessURL: stripe.String(appURL + "/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(appURL + "/dashboard/billing"),
		SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
			Metadata: map[string]string{
				"pb_user_id": user.Id,
				"plan":       body.Plan,
			},
		},
	}
	if len(discounts) > 0 {
		params.Discounts = discounts
	}

	s, err := session.New(params)
	if err != nil {
		return apis.NewBadRequestError("failed to create checkout session", err)
	}

	return e.JSON(200, map[string]any{"url": s.URL})
}
