package redirect

import (
	"net/url"
	"strings"
)

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
