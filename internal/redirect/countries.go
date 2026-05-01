package redirect

import (
	"encoding/json"
	"math"
	"net"
	"net/http"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

type country struct {
	Country string  `json:"country"`
	Code    string  `json:"code"`
	Clicks  int     `json:"clicks"`
	Pct     float64 `json:"pct"`
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
