package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripeinvoice "github.com/stripe/stripe-go/v85/invoice"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

type invoiceInfo struct {
	ID               string `json:"id"`
	Number           string `json:"number"`
	AmountPaid       int64  `json:"amount_paid"`
	Currency         string `json:"currency"`
	Status           string `json:"status"`
	Created          int64  `json:"created"`
	PeriodStart      int64  `json:"period_start"`
	PeriodEnd        int64  `json:"period_end"`
	HostedInvoiceURL string `json:"hosted_invoice_url"`
	InvoicePDF       string `json:"invoice_pdf"`
}

func InfoHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}

	subID := user.GetString("subscription_id")
	customerID := user.GetString("stripe_customer_id")

	if subID == "" || customerID == "" {
		return e.JSON(200, map[string]any{"subscription": nil, "invoices": []invoiceInfo{}})
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

	var invoices []invoiceInfo
	for iter.Next() {
		inv := iter.Invoice()
		if inv.Status == stripe.InvoiceStatusDraft {
			continue
		}
		invoices = append(invoices, invoiceInfo{
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
		invoices = []invoiceInfo{}
	}

	return e.JSON(200, map[string]any{
		"subscription": info,
		"invoices":     invoices,
	})
}
