package redirect

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"strings"
)

func realIP(r *http.Request) string {
	if ip := r.Header.Get("X-Real-IP"); ip != "" {
		return strings.TrimSpace(ip)
	}
	if fwd := r.Header.Get("X-Forwarded-For"); fwd != "" {
		return strings.TrimSpace(strings.Split(fwd, ",")[0])
	}
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
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

func parseBrowser(ua string) string {
	switch {
	case strings.Contains(ua, "Edg/"):
		return "Edge"
	case strings.Contains(ua, "OPR/") || strings.Contains(ua, "Opera"):
		return "Opera"
	case strings.Contains(ua, "Firefox/"):
		return "Firefox"
	case strings.Contains(ua, "Chrome/"):
		return "Chrome"
	case strings.Contains(ua, "Safari/"):
		return "Safari"
	case strings.Contains(ua, "Trident/") || strings.Contains(ua, "MSIE"):
		return "IE"
	default:
		return "Other"
	}
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

func parseDevice(ua string) string {
	switch {
	case strings.Contains(ua, "iPad") || strings.Contains(ua, "Tablet") || strings.Contains(ua, "tablet"):
		return "Tablet"
	case strings.Contains(ua, "Mobile") || strings.Contains(ua, "Android") || strings.Contains(ua, "iPhone") || strings.Contains(ua, "iPod"):
		return "Mobile"
	default:
		return "Desktop"
	}
}

func parseLanguage(acceptLang string) string {
	if acceptLang == "" {
		return ""
	}
	lang := strings.Split(acceptLang, ",")[0]
	lang = strings.Split(lang, ";")[0]
	return strings.TrimSpace(lang)
}

type geoInfo struct {
	Country     string
	CountryCode string
	City        string
	Region      string
	Timezone    string
}

func lookupGeo(ip string) (geoInfo, error) {
	if ip == "" || isPrivateIP(ip) {
		return geoInfo{}, nil
	}
	resp, err := geoClient.Get("http://ip-api.com/json/" + ip + "?fields=country,countryCode,city,regionName,timezone")
	if err != nil {
		return geoInfo{}, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return geoInfo{}, fmt.Errorf("ip-api.com returned status %d", resp.StatusCode)
	}
	var result struct {
		Country     string `json:"country"`
		CountryCode string `json:"countryCode"`
		City        string `json:"city"`
		RegionName  string `json:"regionName"`
		Timezone    string `json:"timezone"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return geoInfo{}, err
	}
	return geoInfo{
		Country:     result.Country,
		CountryCode: result.CountryCode,
		City:        result.City,
		Region:      result.RegionName,
		Timezone:    result.Timezone,
	}, nil
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
