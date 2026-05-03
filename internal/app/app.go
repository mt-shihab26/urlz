package app

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"

	_ "github.com/mt-shihab26/urlz/migrations"
)

func New() *pocketbase.PocketBase {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}
	app := pocketbase.NewWithConfig(pocketbase.Config{
		DefaultDev:     true,
		DefaultDataDir: ".data",
	})
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})
	return app
}
