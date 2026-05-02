package seed

import (
	"fmt"
	"log"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/spf13/cobra"
)

const defaultLinks = 30

func RegisterCmd(app *pocketbase.PocketBase) {
	var (
		email    string
		password string
		count    int
	)

	cmd := &cobra.Command{
		Use:   "seed",
		Short: "Seed the database with fake data for development",
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := app.Bootstrap(); err != nil {
				return fmt.Errorf("bootstrap: %w", err)
			}
			defer app.ResetBootstrapState()

			if err := run(app, email, password, count); err != nil {
				log.Fatal(err)
			}
			return nil
		},
	}
	cmd.Flags().StringVar(&email, "email", "dev@example.com", "user email")
	cmd.Flags().StringVar(&password, "password", "password1234", "user password")
	cmd.Flags().IntVar(&count, "links", defaultLinks, "number of links to create")

	app.RootCmd.AddCommand(cmd)
}

func run(app core.App, userEmail, userPassword string, linkCount int) error {
	user, err := ensureUser(app, userEmail, userPassword)
	if err != nil {
		return fmt.Errorf("seed user: %w", err)
	}
	fmt.Printf("user: %s (%s)\n", user.GetString("email"), user.Id)

	collection, err := app.FindCollectionByNameOrId("links")
	if err != nil {
		return fmt.Errorf("find links collection: %w", err)
	}

	for i := range linkCount {
		link := core.NewRecord(collection)
		totalClicks := randomClicks()

		link.Set("user", user.Id)
		link.Set("code", gofakeit.LetterN(5))
		link.Set("url", gofakeit.URL())
		link.Set("title", gofakeit.Sentence(4))
		link.Set("clicks", totalClicks)
		link.Set("status", randomStatus())
		link.Set("expires", randomExpiry())
		link.Set("series", fakeSeries(totalClicks))
		link.Set("referrers", fakeReferrers(totalClicks))
		link.Set("countries", fakeCountries(totalClicks))

		if err := app.Save(link); err != nil {
			return fmt.Errorf("save link %d: %w", i+1, err)
		}
		fmt.Printf("  link %d: %s → %s\n", i+1, link.GetString("code"), link.GetString("title"))
	}

	fmt.Printf("seeded %d links\n", linkCount)
	return nil
}

func ensureUser(app core.App, email, password string) (*core.Record, error) {
	if existing, err := app.FindAuthRecordByEmail("users", email); err == nil {
		return existing, nil
	}

	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return nil, err
	}

	user := core.NewRecord(collection)
	user.Set("email", email)
	user.Set("name", gofakeit.Name())
	user.SetPassword(password)
	user.Set("emailVisibility", true)

	if err := app.Save(user); err != nil {
		return nil, err
	}
	return user, nil
}
