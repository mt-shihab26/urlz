package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripeinvoice "github.com/stripe/stripe-go/v85/invoice"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

type subscriptionInfo struct {
	ID                 string    `json:"id"`
	Status             string    `json:"status"`
	StartDate          int64     `json:"start_date"`
	CurrentPeriodStart int64     `json:"current_period_start"`
	CurrentPeriodEnd   int64     `json:"current_period_end"`
	CancelAtPeriodEnd  bool      `json:"cancel_at_period_end"`
	CancelAt           *int64    `json:"cancel_at,omitempty"`
	TrialEnd           *int64    `json:"trial_end,omitempty"`
	Invoices           []invoice `json:"invoices"`
}

func SubscriptionHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	subID := user.GetString("subscription_id")
	customerID := user.GetString("stripe_customer_id")

	if subID == "" || customerID == "" {
		return e.JSON(200, map[string]any{"subscription": nil, "invoices": []invoice{}})
	}

	subParams := &stripe.SubscriptionParams{}
	subParams.AddExpand("items.data")
	sub, err := stripesubscription.Get(subID, subParams)
	if err != nil {
		return apis.NewBadRequestError("failed to fetch subscription: "+err.Error(), nil)
	}

	info := subscriptionInfo{
		ID:                sub.ID,
		Status:            string(sub.Status),
		StartDate:         sub.StartDate,
		CancelAtPeriodEnd: sub.CancelAtPeriodEnd,
	}
	// CurrentPeriodStart/End live on SubscriptionItem in stripe-go v85
	if sub.Items != nil && len(sub.Items.Data) > 0 {
		item := sub.Items.Data[0]
		info.CurrentPeriodStart = item.CurrentPeriodStart
		info.CurrentPeriodEnd = item.CurrentPeriodEnd
	}
	if sub.CancelAt != 0 {
		v := sub.CancelAt
		info.CancelAt = &v
	}
	if sub.TrialEnd != 0 {
		v := sub.TrialEnd
		info.TrialEnd = &v
	}

	// Fetch last 12 invoices for this customer
	invoiceParams := &stripe.InvoiceListParams{
		Customer: stripe.String(customerID),
	}
	invoiceParams.Limit = stripe.Int64(12)
	iter := stripeinvoice.List(invoiceParams)

	var invoices []invoice
	for iter.Next() {
		inv := iter.Invoice()
		if inv.Status == stripe.InvoiceStatusDraft {
			continue
		}
		invoices = append(invoices, invoice{
			ID:               inv.ID,
			Number:           inv.Number,
			AmountPaid:       inv.AmountPaid,
			Currency:         string(inv.Currency),
			Status:           string(inv.Status),
			Created:          inv.Created,
			PeriodStart:      inv.PeriodStart,
			PeriodEnd:        inv.PeriodEnd,
			HostedInvoiceURL: inv.HostedInvoiceURL,
			InvoicePDF:       inv.InvoicePDF,
		})
	}
	if invoices == nil {
		invoices = []invoice{}
	}

	return e.JSON(200, map[string]any{
		"subscription": info,
		"invoices":     invoices,
	})
}
