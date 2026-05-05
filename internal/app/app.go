package app

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"
	_ "github.com/tursodatabase/libsql-client-go/libsql"

	_ "github.com/mt-shihab26/urlz/migrations"
)

func tursoConnect(dbPath string) (*dbx.DB, error) {
	tursoURL := os.Getenv("TURSO_DATABASE_URL")
	tursoToken := os.Getenv("TURSO_AUTH_TOKEN")

	// auxiliary.db is ephemeral — keep it local
	if tursoURL == "" || strings.HasSuffix(dbPath, "auxiliary.db") {
		return core.DefaultDBConnect(dbPath)
	}

	url := fmt.Sprintf("%s?authToken=%s", tursoURL, tursoToken)
	db, err := dbx.Open("libsql", url)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func New() *pocketbase.PocketBase {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}
	app := pocketbase.NewWithConfig(pocketbase.Config{
		DefaultDev:     true,
		DefaultDataDir: ".data",
		DBConnect:      tursoConnect,
	})
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})
	return app
}
