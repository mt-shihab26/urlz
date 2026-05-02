package redirect

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

var geoClient = &http.Client{Timeout: 3 * time.Second}

type click struct {
	Date        string `json:"date"`
	CountryName string `json:"country_name"`
	CountryCode string `json:"country_code"`
	Referrer    string `json:"referrer"`
	Browser     string `json:"browser"`
	OS          string `json:"os"`
}

func appendClick(app core.App, record *core.Record, refHeader, ip, ua string) {
	var clicks []click
	data, err := json.Marshal(record.Get("clicks"))
	if err != nil {
		app.Logger().Error("appendClick: marshal", "id", record.Id, "err", err)
		return
	}
	if err := json.Unmarshal(data, &clicks); err != nil {
		app.Logger().Error("appendClick: unmarshal", "id", record.Id, "err", err)
		return
	}

	countryName, countryCode, _ := lookupCountry(ip)

	record.Set("clicks", append(clicks, click{
		Date:        time.Now().UTC().Format("2006-01-02"),
		CountryName: countryName,
		CountryCode: countryCode,
		Referrer:    parseReferrer(refHeader),
		Browser:     parseBrowser(ua),
		OS:          parseOS(ua),
	}))
}
