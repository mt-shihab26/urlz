package redirect

import (
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

var geoClient = &http.Client{Timeout: 3 * time.Second}

func createClick(app core.App, linkID, userID, refHeader, ip, ua string) {
	collection, err := app.FindCollectionByNameOrId("clicks")
	if err != nil {
		app.Logger().Error("createClick: find collection", "err", err)
		return
	}

	countryName, countryCode, _ := lookupCountry(ip)

	record := core.NewRecord(collection)
	record.Set("user", userID)
	record.Set("link", linkID)
	record.Set("date", time.Now().UTC().Format("2006-01-02"))
	record.Set("country_name", countryName)
	record.Set("country_code", countryCode)
	record.Set("referrer", parseReferrer(refHeader))
	record.Set("browser", parseBrowser(ua))
	record.Set("os", parseOS(ua))

	if err := app.Save(record); err != nil {
		app.Logger().Error("createClick: save", "linkId", linkID, "err", err)
	}
}
