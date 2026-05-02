package seed

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
)

const defaultLinks = 30

func Run(app *pocketbase.PocketBase) {
	fs := flag.NewFlagSet("seed", flag.ExitOnError)
	fs.Usage = func() {
		fmt.Fprintln(os.Stderr, "Usage: go run . seed [flags]")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Flags:")
		fs.PrintDefaults()
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Examples:")
		fmt.Fprintln(os.Stderr, "  go run . seed")
		fmt.Fprintln(os.Stderr, "  go run . seed --email dev@example.com --password secret --links 50")
	}
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
	user, err := seedUsers(app, *email, *password)
	if err != nil {
		fmt.Fprintf(os.Stderr, "seed users: %v\n", err)
		os.Exit(1)
	}
	if err := seedLinks(app, user.Id, *count); err != nil {
		fmt.Fprintf(os.Stderr, "seed links: %v\n", err)
		os.Exit(1)
	}
}
