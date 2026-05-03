package hooks

import "github.com/pocketbase/pocketbase/core"

func RegisterUserHooks(app core.App) {
	app.OnRecordCreate("users").BindFunc(func(e *core.RecordEvent) error {
		if e.Record.GetString("plan") == "" {
			e.Record.Set("plan", "free")
		}
		return e.Next()
	})
}
