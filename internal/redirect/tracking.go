package redirect

import "github.com/pocketbase/pocketbase/core"

func trackClick(app core.App, id, refHeader, ip, ua string) {
	record, err := app.FindRecordById("links", id)
	if err != nil {
		app.Logger().Error("trackClick: find record", "id", id, "err", err)
		return
	}
	appendClick(app, record, refHeader, ip, ua)
	if err := app.Save(record); err != nil {
		app.Logger().Error("trackClick: save record", "id", id, "err", err)
	}
}
