package main

import (
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/mt-shihab26/urlz/internal/app"
	"github.com/mt-shihab26/urlz/internal/hooks"
	"github.com/mt-shihab26/urlz/internal/redirect"
	"github.com/mt-shihab26/urlz/internal/routes/analytics"
	"github.com/mt-shihab26/urlz/internal/routes/billing"
	"github.com/mt-shihab26/urlz/internal/routes/clicks"
	"github.com/mt-shihab26/urlz/internal/routes/links/index"
	"github.com/mt-shihab26/urlz/internal/routes/links/show"
	"github.com/mt-shihab26/urlz/internal/routes/overview"
	"github.com/mt-shihab26/urlz/web"
)

func main() {
	a := app.New()

	billing.Init()
	hooks.RegisterLinkHooks(a)
	hooks.RegisterUserHooks(a)

	a.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.POST("/api/billing/checkout", billing.CheckoutHandler)
		se.Router.POST("/api/billing/success", billing.SuccessHandler)
		se.Router.POST("/api/billing/cancel", billing.CancelHandler)
		se.Router.POST("/api/billing/sync-cancel", billing.SyncCancelHandler)
		se.Router.POST("/api/billing/uncancel", billing.UncancelHandler)

		se.Router.GET("/api/billing/subscription", billing.SubscriptionHandler)
		se.Router.GET("/api/billing/invoices", billing.InvoicesHandler)

		se.Router.GET("/api/overview", overview.Handler)
		se.Router.GET("/api/analytics", analytics.Handler)
		se.Router.GET("/api/links", index.Handler)
		se.Router.GET("/api/links/{id}", show.Handler)
		se.Router.GET("/api/clicks", clicks.Handler)

		sub, err := fs.Sub(web.DistFS, "dist")
		if err != nil {
			return err
		}
		fileServer := http.FileServer(http.FS(sub))
		se.Router.GET("/{code}", func(e *core.RequestEvent) error {
			code := e.Request.PathValue("code")
			if strings.Contains(code, ".") {
				fileServer.ServeHTTP(e.Response, e.Request)
				return nil
			}
			return redirect.Handler(e)
		})
		se.Router.GET("/{path...}", apis.Static(sub, true))
		return se.Next()
	})
	if err := a.Start(); err != nil {
		log.Fatal(err)
	}
}
