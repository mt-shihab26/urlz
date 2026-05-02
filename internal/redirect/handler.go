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
	if record.GetString("status") == "disabled" {
		return apis.NewNotFoundError("Link not available", nil)
	}
	if exp := record.GetDateTime("expires"); !exp.IsZero() && time.Now().After(exp.Time()) {
		return apis.NewNotFoundError("Link expired", nil)
	}
	targetURL := record.GetString("url")
	if targetURL == "" {
		return apis.NewNotFoundError("Link has no target URL", nil)
	}
	go createClick(e.App, record.Id, record.GetString("user"), e.Request.Header.Get("Referer"), realIP(e.Request), e.Request.Header.Get("User-Agent"))
	return e.Redirect(http.StatusFound, targetURL)
}
