package seed

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/pocketbase/core"
)

func seedLinks(app core.App, userID string, count int) error {
	linksCol, err := app.FindCollectionByNameOrId("links")
	if err != nil {
		return fmt.Errorf("find links collection: %w", err)
	}
	clicksCol, err := app.FindCollectionByNameOrId("clicks")
	if err != nil {
		return fmt.Errorf("find clicks collection: %w", err)
	}

	for i := range count {
		link := core.NewRecord(linksCol)
		link.Set("user", userID)
		link.Set("code", gofakeit.LetterN(5))
		link.Set("url", gofakeit.URL())
		link.Set("title", gofakeit.Sentence(4))
		link.Set("status", randomStatus())
		link.Set("expires", randomExpiry())
		if err := app.Save(link); err != nil {
			return fmt.Errorf("save link %d: %w", i+1, err)
		}

		totalClicks := rand.Intn(5000)
		if err := seedClicks(app, clicksCol, userID, link.Id, totalClicks); err != nil {
			return err
		}

		fmt.Printf("  link %d: %s → %s (%d clicks)\n", i+1, link.GetString("code"), link.GetString("title"), totalClicks)
	}
	fmt.Printf("seeded %d links\n", count)
	return nil
}

func randomStatus() string {
	if rand.Intn(5) == 0 {
		return "disabled"
	}
	return "active"
}

func randomExpiry() string {
	switch rand.Intn(4) {
	case 0:
		return time.Now().AddDate(0, 0, -rand.Intn(30)-1).UTC().Format("2006-01-02 15:04:05")
	case 1:
		return time.Now().AddDate(0, 0, rand.Intn(60)+1).UTC().Format("2006-01-02 15:04:05")
	default:
		return ""
	}
}
