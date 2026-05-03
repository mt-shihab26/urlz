package hooks

import (
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

		plan := user.GetString("plan")
		if plan == "pro" || plan == "business" {
			return e.Next()
		}

		type countRow struct {
			Total int `db:"total"`
		}
		var row countRow
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
