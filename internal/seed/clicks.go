package seed

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/brianvoe/gofakeit/v6"
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

func seedClicks(app core.App, col *core.Collection, userID, linkID string, total int) error {
	for range total {
		click := core.NewRecord(col)
		country := sampleCountries[rand.Intn(len(sampleCountries))]
		idx := rand.Intn(len(sampleCountries))
		referrer := ""
		if rand.Intn(3) != 0 {
			referrer = referrerSources[rand.Intn(len(referrerSources))]
		}
		click.Set("user", userID)
		click.Set("link", linkID)
		click.Set("date", time.Now().UTC().AddDate(0, 0, -rand.Intn(90)).Format("2006-01-02"))
		click.Set("country_name", country.name)
		click.Set("country_code", country.code)
		click.Set("city", sampleCities[idx])
		click.Set("region", sampleRegions[idx])
		click.Set("timezone", sampleTimezones[idx])
		click.Set("referrer", referrer)
		click.Set("browser", sampleBrowsers[rand.Intn(len(sampleBrowsers))])
		click.Set("os", sampleOS[rand.Intn(len(sampleOS))])
		click.Set("device", sampleDevices[rand.Intn(len(sampleDevices))])
		click.Set("ip", gofakeit.IPv4Address())
		click.Set("user_agent", gofakeit.UserAgent())
		click.Set("language", sampleLanguages[rand.Intn(len(sampleLanguages))])
		if err := app.Save(click); err != nil {
			return fmt.Errorf("save click for link %s: %w", linkID, err)
		}
	}
	return nil
}
