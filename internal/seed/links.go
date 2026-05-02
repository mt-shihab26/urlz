package seed

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/pocketbase/core"
)

var referrerSources = []string{
	"google.com", "twitter.com", "facebook.com", "linkedin.com",
	"reddit.com", "github.com", "youtube.com", "instagram.com",
	"t.co", "bing.com",
}

var sampleCountries = []struct{ name, code string }{
	{"United States", "US"}, {"United Kingdom", "GB"}, {"Germany", "DE"},
	{"France", "FR"}, {"Canada", "CA"}, {"Australia", "AU"},
	{"India", "IN"}, {"Brazil", "BR"}, {"Japan", "JP"}, {"Netherlands", "NL"},
}

var sampleOS = []string{"Windows", "macOS", "Linux", "Android", "iOS"}

func seedLinks(app core.App, userID string, count int) error {
	collection, err := app.FindCollectionByNameOrId("links")
	if err != nil {
		return fmt.Errorf("find links collection: %w", err)
	}
	for i := range count {
		link := core.NewRecord(collection)
		totalClicks := rand.Intn(5000)
		link.Set("user", userID)
		link.Set("code", gofakeit.LetterN(5))
		link.Set("url", gofakeit.URL())
		link.Set("title", gofakeit.Sentence(4))
		link.Set("status", randomStatus())
		link.Set("expires", randomExpiry())
		link.Set("clicks", fakeClicks(totalClicks))
		if err := app.Save(link); err != nil {
			return fmt.Errorf("save link %d: %w", i+1, err)
		}
		fmt.Printf("  link %d: %s → %s\n", i+1, link.GetString("code"), link.GetString("title"))
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

func fakeClicks(total int) []map[string]any {
	clicks := make([]map[string]any, total)
	for i := range total {
		daysAgo := rand.Intn(90)
		date := time.Now().UTC().AddDate(0, 0, -daysAgo).Format("2006-01-02")
		country := sampleCountries[rand.Intn(len(sampleCountries))]
		referrer := ""
		if rand.Intn(3) != 0 {
			referrer = referrerSources[rand.Intn(len(referrerSources))]
		}
		clicks[i] = map[string]any{
			"date":         date,
			"country_name": country.name,
			"country_code": country.code,
			"referrer":     referrer,
			"os":           sampleOS[rand.Intn(len(sampleOS))],
		}
	}
	return clicks
}
