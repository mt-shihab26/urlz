package main

import (
	"io/fs"
	"log"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/mt-shihab26/urlz/internal/app"
	"github.com/mt-shihab26/urlz/internal/billing"
	"github.com/mt-shihab26/urlz/internal/hooks"
	"github.com/mt-shihab26/urlz/internal/redirect"
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

		se.Router.GET("/{code}", redirect.Handler)
		sub, err := fs.Sub(web.DistFS, "dist")
		if err != nil {
			return err
		}
		se.Router.GET("/{path...}", apis.Static(sub, true))
		return se.Next()
	})
	if err := a.Start(); err != nil {
		log.Fatal(err)
	}
}
