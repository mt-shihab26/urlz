package main

import (
	"io/fs"
	"log"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"

	"github.com/mt-shihab26/urlz/internal/app"
	"github.com/mt-shihab26/urlz/internal/redirect"
	"github.com/mt-shihab26/urlz/web"
)

func main() {
	app := app.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/{code}", redirect.Handler)
		sub, err := fs.Sub(web.DistFS, "dist")
		if err != nil {
			return err
		}
		se.Router.GET("/{path...}", apis.Static(sub, true))
		return se.Next()
	})
	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
