package billing

import (
	"time"

	"github.com/pocketbase/pocketbase/core"
)

func GetActivePlan(user *core.Record) string {
	if user == nil || !IsPlanActive(user) {
		return "free"
	}
	plan := user.GetString("plan")
	if plan == "" {
		return "free"
	}
	return plan
}

func IsPlanActive(user *core.Record) bool {
	if user == nil {
		return false
	}
	var activeStatuses = map[string]bool{
		"active":   true,
		"trialing": true,
	}
	if !activeStatuses[user.GetString("subscription_status")] {
		return false
	}
	cancelAt := user.GetString("subscription_cancel_at")
	if cancelAt != "" {
		t, err := time.Parse(time.RFC3339, cancelAt)
		if err == nil && !t.After(time.Now().UTC()) {
			return false
		}
	}
	return true
}
