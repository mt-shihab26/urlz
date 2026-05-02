package redirect

import (
	"net"
	"net/http"
	"strings"
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
	go trackClick(e.App, record.Id, e.Request.Header.Get("Referer"), realIP(e.Request))
	return e.Redirect(http.StatusFound, targetURL)
}

func realIP(r *http.Request) string {
	if ip := r.Header.Get("X-Real-IP"); ip != "" {
		return strings.TrimSpace(ip)
	}
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		return strings.TrimSpace(strings.Split(fwd, ",")[0])
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}
