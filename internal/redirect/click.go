package redirect

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

var geoClient = &http.Client{Timeout: 3 * time.Second}

type click struct {
	Date        string `json:"date"`
	CountryName string `json:"country_name"`
	CountryCode string `json:"country_code"`
	Referrer    string `json:"referrer"`
	OS          string `json:"os"`
}

func appendClick(app core.App, record *core.Record, refHeader, ip, ua string) {
	var clicks []click
	data, err := json.Marshal(record.Get("clicks"))
	if err != nil {
		app.Logger().Error("appendClick: marshal", "id", record.Id, "err", err)
		return
	}
	if err := json.Unmarshal(data, &clicks); err != nil {
		app.Logger().Error("appendClick: unmarshal", "id", record.Id, "err", err)
		return
	}

	countryName, countryCode, _ := lookupCountry(ip)

	record.Set("clicks", append(clicks, click{
		Date:        time.Now().UTC().Format("2006-01-02"),
		CountryName: countryName,
		CountryCode: countryCode,
		Referrer:    parseReferrer(refHeader),
		OS:          parseOS(ua),
	}))
}

func parseReferrer(refHeader string) string {
	if refHeader == "" {
		return ""
	}
	u, err := url.Parse(refHeader)
	if err != nil || u.Hostname() == "" {
		return ""
	}
	return u.Hostname()
}

func parseOS(ua string) string {
	switch {
	case strings.Contains(ua, "Android"):
		return "Android"
	case strings.Contains(ua, "iPhone") || strings.Contains(ua, "iPad") || strings.Contains(ua, "iPod"):
		return "iOS"
	case strings.Contains(ua, "Windows"):
		return "Windows"
	case strings.Contains(ua, "Mac OS X"):
		return "macOS"
	case strings.Contains(ua, "Linux"):
		return "Linux"
	default:
		return "Other"
	}
}

func lookupCountry(ip string) (name, code string, err error) {
	if ip == "" || isPrivateIP(ip) {
		return "", "", nil
	}
	resp, err := geoClient.Get("http://ip-api.com/json/" + ip + "?fields=country,countryCode")
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("ip-api.com returned status %d", resp.StatusCode)
	}
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
