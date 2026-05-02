package redirect

import (
	"time"

	"github.com/pocketbase/pocketbase/core"
)

func createClick(app core.App, linkID, userID, refHeader, ip, ua, acceptLang string) {
	collection, err := app.FindCollectionByNameOrId("clicks")
	if err != nil {
		app.Logger().Error("createClick: find collection", "err", err)
		return
	}

	geo, _ := lookupGeo(ip)

	record := core.NewRecord(collection)
	record.Set("user", userID)
	record.Set("link", linkID)
	record.Set("date", time.Now().UTC().Format("2006-01-02"))
	record.Set("country_name", geo.Country)
	record.Set("country_code", geo.CountryCode)
	record.Set("city", geo.City)
	record.Set("region", geo.Region)
	record.Set("timezone", geo.Timezone)
	record.Set("referrer", parseReferrer(refHeader))
	record.Set("browser", parseBrowser(ua))
	record.Set("os", parseOS(ua))
	record.Set("device", parseDevice(ua))
	record.Set("ip", ip)
	record.Set("user_agent", ua)
	record.Set("language", parseLanguage(acceptLang))

	if err := app.Save(record); err != nil {
		app.Logger().Error("createClick: save", "linkId", linkID, "err", err)
	}
}
