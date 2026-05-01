package redirect

import (
	"encoding/json"
	"net/url"

	"github.com/pocketbase/pocketbase/core"
)

type referrer struct {
	Source string `json:"source"`
	Clicks int    `json:"clicks"`
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
