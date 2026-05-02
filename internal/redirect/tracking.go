package redirect

import "github.com/pocketbase/pocketbase/core"

func trackClick(app core.App, id, refHeader string, ip string) {
	record, err := app.FindRecordById("links", id)
	if err != nil {
		app.Logger().Error("trackClick: find record", "id", id, "err", err)
		return
	}
	record.Set("clicks", record.GetInt("clicks")+1)
	record.Set("series", updatedSeries(app, record))
	record.Set("referrers", updatedReferrers(app, record, refHeader))
	record.Set("countries", updatedCountries(app, record, ip))
	if err := app.Save(record); err != nil {
		app.Logger().Error("trackClick: save record", "id", id, "err", err)
	}
}
