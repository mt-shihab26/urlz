package seed

import (
	"fmt"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/pocketbase/core"
)

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
