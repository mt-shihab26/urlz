package hooks

import (
	"github.com/mt-shihab26/urlz/internal/routes/billing"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

const freeLinkLimit = 5

func RegisterLinkHooks(app core.App) {
	app.OnRecordCreate("links").BindFunc(func(e *core.RecordEvent) error {
		userID := e.Record.GetString("user")
		if userID == "" {
			return e.Next()
		}
		user, err := app.FindRecordById("users", userID)
		if err != nil {
			return e.Next()
		}
		plan := billing.GetActivePlan(user)
		if e.Record.GetString("expires") != "" && plan == "free" {
			return apis.NewBadRequestError("Link expiry dates require a Pro plan.", nil)
		}
		if plan != "free" {
			return e.Next()
		}
		var row struct {
			Total int `db:"total"`
		}
		err = app.DB().
			NewQuery("SELECT count(*) as total FROM links WHERE user = {:user}").
			Bind(map[string]any{"user": userID}).
			One(&row)
		if err != nil {
			return e.Next()
		}
		if row.Total >= freeLinkLimit {
			return apis.NewBadRequestError(
				"Free plan limit reached (5 links). Upgrade to Pro for unlimited links.",
				nil,
			)
		}
		return e.Next()
	})
}
