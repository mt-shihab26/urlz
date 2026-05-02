package main

import (
	"io/fs"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"

	"github.com/mt-shihab26/urlz/internal/redirect"
	"github.com/mt-shihab26/urlz/internal/seed"
	_ "github.com/mt-shihab26/urlz/migrations"
	"github.com/mt-shihab26/urlz/web"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}
	app := pocketbase.NewWithConfig(pocketbase.Config{
		DefaultDev:     true,
		DefaultDataDir: ".data",
	})
	if len(os.Args) > 1 && os.Args[1] == "seed" {
		seed.Run(app)
		return
	}
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})
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
