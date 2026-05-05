package billing

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/stripe/stripe-go/v85"
	"github.com/stripe/stripe-go/v85/checkout/session"
)

func SuccessHandler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	var body struct {
		SessionID string `json:"session_id"`
	}
	if err := e.BindBody(&body); err != nil || body.SessionID == "" {
		return apis.NewBadRequestError("missing session_id", nil)
	}
	s, err := session.Get(body.SessionID, &stripe.CheckoutSessionParams{
		Expand: []*string{stripe.String("subscription")},
	})
	if err != nil {
		return apis.NewBadRequestError("failed to fetch session: "+err.Error(), nil)
	}
	if s.Metadata["user_id"] != user.Id {
		return apis.NewForbiddenError("session does not belong to this user", nil)
	}
	plan := s.Metadata["plan"]
	if plan == "" {
		plan = "pro"
	}
	if s.Subscription == nil {
		return apis.NewBadRequestError("no subscription found on session", nil)
	}
	subID := s.Subscription.ID
	subStatus := string(s.Subscription.Status)
	user.Set("plan", plan)
	user.Set("subscription_id", subID)
	user.Set("subscription_status", subStatus)
	user.Set("subscription_cancel_at", "")
	if err := e.App.Save(user); err != nil {
		return apis.NewBadRequestError("failed to update user", err)
	}
	return e.JSON(200, map[string]any{"ok": true})
}
