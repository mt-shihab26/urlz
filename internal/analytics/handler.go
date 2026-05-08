package analytics

import (
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type response struct {
	Stats        statsData      `json:"stats"`
	Volume       []volumeDay    `json:"volume"`
	Breakdown    breakdownData  `json:"breakdown"`
	ExpiringSoon []expiringLink `json:"expiring_soon"`
	NoClicks     []noClickLink  `json:"no_clicks"`
	TopLinks     []topLink      `json:"top_links"`
}

func startDate(rangeParam string) string {
	days := map[string]int{"7d": 7, "30d": 30, "90d": 90}
	d, ok := days[rangeParam]
	if !ok {
		return ""
	}
	return time.Now().AddDate(0, 0, -d).Format("2006-01-02")
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()
	since := startDate(e.Request.URL.Query().Get("range"))

	var (
		volume       []volumeDay
		uv           int
		lc           linkCounts
		breakdown    breakdownData
		expiringSoon []expiringLink
		noClicks     []noClickLink
		topLinks     []topLink
		wg           sync.WaitGroup
	)

	wg.Add(7)
	go func() { defer wg.Done(); volume = fetchVolume(db, uid, since) }()
	go func() { defer wg.Done(); uv = fetchUniqueVisitors(db, uid, since) }()
	go func() { defer wg.Done(); lc = fetchLinkCounts(db, uid, since) }()
	go func() { defer wg.Done(); breakdown = fetchBreakdown(db, uid, since) }()
	go func() { defer wg.Done(); expiringSoon = fetchExpiringSoon(db, uid) }()
	go func() { defer wg.Done(); noClicks = fetchNoClicks(db, uid, since) }()
	go func() { defer wg.Done(); topLinks = fetchTopLinks(db, uid, since) }()
	wg.Wait()

	return e.JSON(200, response{
		Stats:        buildStats(volume, uv, lc),
		Volume:       volume,
		Breakdown:    breakdown,
		ExpiringSoon: expiringSoon,
		NoClicks:     noClicks,
		TopLinks:     topLinks,
	})
}
