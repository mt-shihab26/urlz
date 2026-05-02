package seed

import (
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit/v6"
)

const seriesDays = 90

var referrerSources = []string{
	"google.com", "twitter.com", "facebook.com", "linkedin.com",
	"reddit.com", "github.com", "youtube.com", "instagram.com",
	"t.co", "bing.com",
}

func randomClicks() int {
	return rand.Intn(5000)
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
			clicks = rand.Intn(remaining/seriesDays*3 + 1)
			if clicks > remaining {
				clicks = remaining
			}
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
	sources := shuffled[:count]
	weights := randomWeights(count)
	refs := make([]map[string]any, count)
	for i, src := range sources {
		refs[i] = map[string]any{
			"source": src,
			"clicks": int(float64(total) * weights[i]),
		}
	}
	return refs
}
