package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripeinvoice "github.com/stripe/stripe-go/v85/invoice"
)

type invoice struct {
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

func InvoicesHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	subscriptionID := user.GetString("subscription_id")
	customerID := user.GetString("stripe_customer_id")
	if subscriptionID == "" || customerID == "" {
		return e.JSON(200, []invoice{})
	}
	params := &stripe.InvoiceListParams{Customer: stripe.String(customerID)}
	iter := stripeinvoice.List(params)
	var invoices []invoice
	for iter.Next() {
		inv := iter.Invoice()
		if inv.Status == stripe.InvoiceStatusDraft {
			continue
		}
		periodStart := inv.PeriodStart
		periodEnd := inv.PeriodEnd
		if inv.Lines != nil && len(inv.Lines.Data) > 0 {
			periodStart = inv.Lines.Data[0].Period.Start
			periodEnd = inv.Lines.Data[0].Period.End
		}
		invoices = append(invoices, invoice{
			ID:               inv.ID,
			Number:           inv.Number,
			AmountPaid:       inv.AmountPaid,
			Currency:         string(inv.Currency),
			Status:           string(inv.Status),
			Created:          inv.Created,
			PeriodStart:      periodStart,
			PeriodEnd:        periodEnd,
			HostedInvoiceURL: inv.HostedInvoiceURL,
			InvoicePDF:       inv.InvoicePDF,
		})
	}
	if invoices == nil {
		invoices = []invoice{}
	}
	return e.JSON(200, invoices)
}
