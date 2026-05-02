package redirect

import (
	"encoding/json"
	"math"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

type uaStat struct {
	Name   string  `json:"name"`
	Clicks int     `json:"clicks"`
	Pct    float64 `json:"pct"`
}

func updatedBrowsers(app core.App, record *core.Record, ua string) []uaStat {
	return updatedUAStat(app, record, "browsers", parseBrowser(ua))
}

func updatedOS(app core.App, record *core.Record, ua string) []uaStat {
	return updatedUAStat(app, record, "oses", parseOS(ua))
}

func updatedUAStat(app core.App, record *core.Record, field, name string) []uaStat {
	var stats []uaStat
	data, err := json.Marshal(record.Get(field))
	if err != nil {
		app.Logger().Error("updatedUAStat: marshal", "field", field, "id", record.Id, "err", err)
		return stats
	}
	if err := json.Unmarshal(data, &stats); err != nil {
		app.Logger().Error("updatedUAStat: unmarshal", "field", field, "id", record.Id, "err", err)
		return stats
	}
	if name == "" {
		return stats
	}
	for i, s := range stats {
		if s.Name == name {
			stats[i].Clicks++
			return withUAPct(stats)
		}
	}
	return withUAPct(append(stats, uaStat{Name: name, Clicks: 1}))
}

func withUAPct(stats []uaStat) []uaStat {
	total := 0
	for _, s := range stats {
		total += s.Clicks
	}
	if total == 0 {
		return stats
	}
	for i, s := range stats {
		stats[i].Pct = math.Round(float64(s.Clicks)/float64(total)*1000) / 10
	}
	return stats
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
