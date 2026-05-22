package redirect

import (
	_ "embed"
	"html/template"
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

//go:embed not_found.tmpl
var notFoundTmplStr string

var notFoundTmpl = template.Must(template.New("not-found").Parse(notFoundTmplStr))

func notFound(e *core.RequestEvent, message string) error {
	e.Response.Header().Set("Content-Type", "text/html; charset=utf-8")
	e.Response.WriteHeader(http.StatusNotFound)
	return notFoundTmpl.Execute(e.Response, struct{ Message string }{message})
}

func Handler(e *core.RequestEvent) error {
	code := e.Request.PathValue("code")
	record, err := e.App.FindFirstRecordByData("links", "code", code)
	if err != nil {
		return notFound(e, "Link not found.")
	}
	if record.GetString("status") == "disabled" {
		return notFound(e, "Link not available.")
	}
	if exp := record.GetDateTime("expires"); !exp.IsZero() && time.Now().After(exp.Time()) {
		return notFound(e, "Link expired.")
	}
	targetURL := record.GetString("url")
	if targetURL == "" {
		return notFound(e, "Link not found.")
	}
	go createClick(e.App, record.Id, record.GetString("user"), e.Request.Header.Get("Referer"), realIP(e.Request), e.Request.Header.Get("User-Agent"), e.Request.Header.Get("Accept-Language"))
	return e.Redirect(http.StatusFound, targetURL)
}
