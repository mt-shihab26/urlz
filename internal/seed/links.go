package seed

import (
	"fmt"
	"math"
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/pocketbase/core"
)

const seriesDays = 90

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

func fakeSeries(total int) []map[string]any {
	series := make([]map[string]any, seriesDays)
	remaining := total
	for i := range seriesDays {
		day := time.Now().UTC().AddDate(0, 0, -(seriesDays - 1 - i))
		clicks := 0
		if remaining > 0 {
			clicks = min(rand.Intn(remaining/seriesDays*3+1), remaining)
			remaining -= clicks
		}
		series[i] = map[string]any{
			"date":   day.Format("2006-01-02"),
			"clicks": clicks,
		}
	}
	return series
}

func fakeReferrers(total int) []map[string]any {
	if total == 0 {
		return nil
	}
	count := rand.Intn(5) + 1
	shuffled := append([]string(nil), referrerSources...)
	gofakeit.ShuffleStrings(shuffled)
	weights := randomWeights(count)
	refs := make([]map[string]any, count)
	for i, src := range shuffled[:count] {
		refs[i] = map[string]any{
			"source": src,
			"clicks": int(float64(total) * weights[i]),
		}
	}
	return refs
}

func fakeCountries(total int) []map[string]any {
	if total == 0 {
		return nil
	}
	count := min(rand.Intn(6)+2, len(sampleCountries))
	perm := rand.Perm(len(sampleCountries))[:count]
	weights := randomWeights(count)
	countries := make([]map[string]any, count)
	for i, idx := range perm {
		c := sampleCountries[idx]
		clicks := int(math.Round(float64(total) * weights[i]))
		countries[i] = map[string]any{
			"country": c.name,
			"code":    c.code,
			"clicks":  clicks,
			"pct":     math.Round(weights[i]*1000) / 10,
		}
	}
	return countries
}

func randomWeights(n int) []float64 {
	raw := make([]float64, n)
	sum := 0.0
	for i := range n {
		raw[i] = rand.Float64() + 0.1
		sum += raw[i]
	}
	for i := range n {
		raw[i] /= sum
	}
	return raw
}
