package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripeinvoice "github.com/stripe/stripe-go/v85/invoice"
)

type subscriptionInfo struct {
	ID                 string        `json:"id"`
	Status             string        `json:"status"`
	StartDate          int64         `json:"start_date"`
	CurrentPeriodStart int64         `json:"current_period_start"`
	CurrentPeriodEnd   int64         `json:"current_period_end"`
	CancelAtPeriodEnd  bool          `json:"cancel_at_period_end"`
	CancelAt           *int64        `json:"cancel_at,omitempty"`
	TrialEnd           *int64        `json:"trial_end,omitempty"`
	Invoices           []invoiceInfo `json:"invoices"`
}

func InvoicesHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	subscriptionID := user.GetString("subscription_id")
	customerID := user.GetString("stripe_customer_id")
	if subscriptionID == "" || customerID == "" {
		return e.JSON(200, []invoiceInfo{})
	}
	params := &stripe.InvoiceListParams{Customer: stripe.String(customerID)}
	params.Limit = stripe.Int64(12)
	iter := stripeinvoice.List(params)
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
	return e.JSON(200, invoices)
}
