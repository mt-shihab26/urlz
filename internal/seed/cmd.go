package seed

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
)

const defaultLinks = 30

func RunCmd(app *pocketbase.PocketBase) {
	fs := flag.NewFlagSet("seed", flag.ExitOnError)

	email := fs.String("email", "dev@example.com", "user email")
	password := fs.String("password", "password1234", "user password")
	count := fs.Int("links", defaultLinks, "number of links to create")

	if err := fs.Parse(os.Args[2:]); err != nil {
		log.Fatal(err)
	}
	if err := app.Bootstrap(); err != nil {
		log.Fatalf("bootstrap: %v", err)
	}
	defer app.ResetBootstrapState()
	if err := run(app, *email, *password, *count); err != nil {
		fmt.Fprintf(os.Stderr, "seed: %v\n", err)
		os.Exit(1)
	}
}
