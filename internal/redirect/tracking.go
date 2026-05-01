package redirect

import (
	"encoding/json"
	"math"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

type serie struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

type referrer struct {
	Source string `json:"source"`
	Clicks int    `json:"clicks"`
}

type country struct {
	Country string  `json:"country"`
	Code    string  `json:"code"`
	Clicks  int     `json:"clicks"`
	Pct     float64 `json:"pct"`
}

func trackClick(app core.App, id, refHeader, ip string) {
	record, err := app.FindRecordById("links", id)
	if err != nil {
		app.Logger().Error("trackClick: find record", "id", id, "err", err)
		return
	}

	record.Set("clicks", record.GetInt("clicks")+1)
	record.Set("series", updatedSeries(record))
	record.Set("referrers", updatedReferrers(record, refHeader))
	record.Set("countries", updatedCountries(app, record, ip))

	if err := app.Save(record); err != nil {
		app.Logger().Error("trackClick: save record", "id", id, "err", err)
	}
}

func updatedSeries(record *core.Record) []serie {
	today := time.Now().UTC().Format("2006-01-02")

	var series []serie
	if data, err := json.Marshal(record.Get("series")); err == nil {
		_ = json.Unmarshal(data, &series)
	}

	for i, s := range series {
		if s.Date == today {
			series[i].Clicks++
			return series
		}
	}

	return append(series, serie{Date: today, Clicks: 1})
}

func updatedReferrers(record *core.Record, refHeader string) []referrer {
	var referrers []referrer
	if data, err := json.Marshal(record.Get("referrers")); err == nil {
		_ = json.Unmarshal(data, &referrers)
	}

	source := parseReferrerSource(refHeader)
	if source == "" {
		return referrers
	}

	for i, r := range referrers {
		if r.Source == source {
			referrers[i].Clicks++
			return referrers
		}
	}

	return append(referrers, referrer{Source: source, Clicks: 1})
}

func updatedCountries(app core.App, record *core.Record, ip string) []country {
	var countries []country
	if data, err := json.Marshal(record.Get("countries")); err == nil {
		_ = json.Unmarshal(data, &countries)
	}

	name, code, err := lookupCountry(ip)
	if err != nil {
		app.Logger().Warn("updatedCountries: lookup failed", "ip", ip, "err", err)
		return countries
	}
	if name == "" {
		return countries
	}

	for i, c := range countries {
		if c.Code == code {
			countries[i].Clicks++
			return withPct(countries)
		}
	}

	return withPct(append(countries, country{Country: name, Code: code, Clicks: 1}))
}

func withPct(countries []country) []country {
	total := 0
	for _, c := range countries {
		total += c.Clicks
	}
	if total == 0 {
		return countries
	}
	for i, c := range countries {
		countries[i].Pct = math.Round(float64(c.Clicks)/float64(total)*1000) / 10
	}
	return countries
}

func lookupCountry(ip string) (name, code string, err error) {
	if ip == "" || isPrivateIP(ip) {
		return "", "", nil
	}

	resp, err := http.Get("http://ip-api.com/json/" + ip + "?fields=country,countryCode")
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()

	var result struct {
		Country     string `json:"country"`
		CountryCode string `json:"countryCode"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", "", err
	}
	return result.Country, result.CountryCode, nil
}

func isPrivateIP(ip string) bool {
	parsed := net.ParseIP(strings.TrimSpace(ip))
	if parsed == nil {
		return true
	}
	private := []string{"10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16", "127.0.0.0/8", "::1/128", "fc00::/7"}
	for _, cidr := range private {
		_, block, _ := net.ParseCIDR(cidr)
		if block != nil && block.Contains(parsed) {
			return true
		}
	}
	return false
}

func parseReferrerSource(refHeader string) string {
	if refHeader == "" {
		return ""
	}
	u, err := url.Parse(refHeader)
	if err != nil || u.Hostname() == "" {
		return ""
	}
	return u.Hostname()
}
