package redirect

import (
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type serie struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

type referrer struct {
	Source string `json:"source"`
	Clicks int    `json:"clicks"`
}

func Handler(e *core.RequestEvent) error {
	code := e.Request.PathValue("code")

	record, err := e.App.FindFirstRecordByData("links", "code", code)
	if err != nil {
		return apis.NewNotFoundError("Link not found", nil)
	}

	switch record.GetString("status") {
	case "disabled", "expired":
		return apis.NewNotFoundError("Link not available", nil)
	}

	if exp := record.GetDateTime("expires"); !exp.IsZero() && time.Now().After(exp.Time()) {
		go func() {
			record.Set("status", "expired")
			_ = e.App.Save(record)
		}()
		return apis.NewNotFoundError("Link expired", nil)
	}

	targetURL := record.GetString("url")

	go trackClick(e.App, record.Id, e.Request.Header.Get("Referer"))

	return e.Redirect(http.StatusFound, targetURL)
}

func trackClick(app core.App, id string, refHeader string) {
	record, err := app.FindRecordById("links", id)
	if err != nil {
		return
	}

	record.Set("clicks", record.GetInt("clicks")+1)
	record.Set("series", updatedSeries(record))
	record.Set("referrers", updatedReferrers(record, refHeader))

	_ = app.Save(record)
}

func updatedSeries(record *core.Record) []serie {
	today := time.Now().UTC().Format("2006-01-02")

	var series []serie
	if data, err := json.Marshal(record.Get("series")); err == nil {
		_ = json.Unmarshal(data, &series)
	}

	for i, s := range series {
		if s.Date == today {
			series[i].Clicks++
			return series
		}
	}

	return append(series, serie{Date: today, Clicks: 1})
}

func updatedReferrers(record *core.Record, refHeader string) []referrer {
	var referrers []referrer
	if data, err := json.Marshal(record.Get("referrers")); err == nil {
		_ = json.Unmarshal(data, &referrers)
	}

	source := parseReferrerSource(refHeader)
	if source == "" {
		return referrers
	}

	for i, r := range referrers {
		if r.Source == source {
			referrers[i].Clicks++
			return referrers
		}
	}

	return append(referrers, referrer{Source: source, Clicks: 1})
}

func parseReferrerSource(refHeader string) string {
	if refHeader == "" {
		return ""
	}
	u, err := url.Parse(refHeader)
	if err != nil || u.Hostname() == "" {
		return ""
	}
	return u.Hostname()
}
