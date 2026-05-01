package redirect

import (
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

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
