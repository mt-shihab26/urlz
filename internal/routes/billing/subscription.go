package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	stripesubscription "github.com/stripe/stripe-go/v85/subscription"
)

type subscription struct {
	ID                 string `json:"id"`
	Status             string `json:"status"`
	StartDate          int64  `json:"start_date"`
	CurrentPeriodStart int64  `json:"current_period_start"`
	CurrentPeriodEnd   int64  `json:"current_period_end"`
	CancelAtPeriodEnd  bool   `json:"cancel_at_period_end"`
	CancelAt           *int64 `json:"cancel_at,omitempty"`
	TrialEnd           *int64 `json:"trial_end,omitempty"`
}

func SubscriptionHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	subID := user.GetString("subscription_id")
	customerID := user.GetString("stripe_customer_id")
	if subID == "" || customerID == "" {
		return e.JSON(200, nil)
	}
	subParams := &stripe.SubscriptionParams{}
	subParams.AddExpand("items.data")
	sub, err := stripesubscription.Get(subID, subParams)
	if err != nil {
		return apis.NewBadRequestError("failed to fetch subscription: "+err.Error(), nil)
	}
	data := subscription{
		ID:                sub.ID,
		Status:            string(sub.Status),
		StartDate:         sub.StartDate,
		CancelAtPeriodEnd: sub.CancelAtPeriodEnd,
	}
	// CurrentPeriodStart/End live on SubscriptionItem in stripe-go v85
	if sub.Items != nil && len(sub.Items.Data) > 0 {
		item := sub.Items.Data[0]
		data.CurrentPeriodStart = item.CurrentPeriodStart
		data.CurrentPeriodEnd = item.CurrentPeriodEnd
	}
	if sub.CancelAt != 0 {
		v := sub.CancelAt
		data.CancelAt = &v
	}
	if sub.TrialEnd != 0 {
		v := sub.TrialEnd
		data.TrialEnd = &v
	}
	return e.JSON(200, data)
}
