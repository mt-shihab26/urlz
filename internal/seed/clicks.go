package seed

import (
	"fmt"
	"math/rand"
	"strings"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
)

var sampleCountries = []struct{ name, code string }{
	{"United States", "US"}, {"United Kingdom", "GB"}, {"Germany", "DE"},
	{"France", "FR"}, {"Canada", "CA"}, {"Australia", "AU"},
	{"India", "IN"}, {"Brazil", "BR"}, {"Japan", "JP"}, {"Netherlands", "NL"},
}

var sampleOS = []string{"Windows", "macOS", "Linux", "Android", "iOS"}
var sampleBrowsers = []string{"Chrome", "Firefox", "Safari", "Edge", "Opera"}
var sampleDevices = []string{"Desktop", "Mobile", "Tablet"}
var sampleCities = []string{"New York", "London", "Berlin", "Paris", "Toronto", "Sydney", "Mumbai", "São Paulo", "Tokyo", "Amsterdam"}
var sampleRegions = []string{"New York", "England", "Bavaria", "Île-de-France", "Ontario", "New South Wales", "Maharashtra", "São Paulo", "Tokyo", "North Holland"}
var sampleTimezones = []string{"America/New_York", "Europe/London", "Europe/Berlin", "Europe/Paris", "America/Toronto", "Australia/Sydney", "Asia/Kolkata", "America/Sao_Paulo", "Asia/Tokyo", "Europe/Amsterdam"}
var sampleLanguages = []string{"en-US", "en-GB", "de-DE", "fr-FR", "en-CA", "en-AU", "hi-IN", "pt-BR", "ja-JP", "nl-NL"}
var referrerSources = []string{
	"google.com", "twitter.com", "facebook.com", "linkedin.com",
	"reddit.com", "github.com", "youtube.com", "instagram.com",
	"t.co", "bing.com",
}

const (
	clickBatchSize = 500
	clickIDAlpha   = "abcdefghijklmnopqrstuvwxyz0123456789"
)

var clickColNames = []string{
	"id", "user", "link", "date",
	"country_name", "country_code", "city", "region", "timezone",
	"referrer", "browser", "os", "device",
	"ip", "user_agent", "language",
	"created", "updated",
}

func seedClicks(app core.App, userID, linkID string, total int) error {
	if total == 0 {
		return nil
	}

	colList := strings.Join(clickColNames, ", ")
	now := time.Now().UTC().Format("2006-01-02 15:04:05.000Z")

	for start := 0; start < total; start += clickBatchSize {
		end := min(start+clickBatchSize, total)
		n := end - start

		rows := make([]string, n)
		params := make(dbx.Params, n*len(clickColNames))

		for i := range n {
			placeholders := make([]string, len(clickColNames))
			for j, col := range clickColNames {
				key := fmt.Sprintf("%s%d", col, i)
				placeholders[j] = "{:" + key + "}"
			}
			rows[i] = "(" + strings.Join(placeholders, ", ") + ")"

			country := sampleCountries[rand.Intn(len(sampleCountries))]
			idx := rand.Intn(len(sampleCountries))
			referrer := ""
			if rand.Intn(3) != 0 {
				referrer = referrerSources[rand.Intn(len(referrerSources))]
			}
			date := time.Now().UTC().AddDate(0, 0, -rand.Intn(90)).Format("2006-01-02")

			vals := []any{
				randomID(), userID, linkID, date,
				country.name, country.code, sampleCities[idx], sampleRegions[idx], sampleTimezones[idx],
				referrer, sampleBrowsers[rand.Intn(len(sampleBrowsers))], sampleOS[rand.Intn(len(sampleOS))], sampleDevices[rand.Intn(len(sampleDevices))],
				gofakeit.IPv4Address(), gofakeit.UserAgent(), sampleLanguages[rand.Intn(len(sampleLanguages))],
				now, now,
			}
			for j, col := range clickColNames {
				params[fmt.Sprintf("%s%d", col, i)] = vals[j]
			}
		}

		sql := fmt.Sprintf("INSERT INTO clicks (%s) VALUES %s", colList, strings.Join(rows, ", "))
		if _, err := app.DB().NewQuery(sql).Bind(params).Execute(); err != nil {
			return fmt.Errorf("bulk insert clicks batch %d: %w", start/clickBatchSize, err)
		}
	}
	return nil
}

func randomID() string {
	b := make([]byte, 15)
	for i := range b {
		b[i] = clickIDAlpha[rand.Intn(len(clickIDAlpha))]
	}
	return string(b)
}
