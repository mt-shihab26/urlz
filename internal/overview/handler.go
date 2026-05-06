package overview

import (
	"sync"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type response struct {
	TotalClicks    int           `json:"total_clicks"`
	ActiveLinks    int           `json:"active_links"`
	TotalLinks     int           `json:"total_links"`
	UniqueVisitors int           `json:"unique_visitors"`
	AvgDailyClicks int           `json:"avg_daily_clicks"`
	ClickDelta     int           `json:"click_delta"`
	Breakdown      breakdownData `json:"breakdown"`
	TopLinks       []topLink     `json:"top_links"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()

	var (
		totalClicks, avgDailyClicks, clickDelta int
		totalLinks, activeLinks                 int
		uniqueVisitors                          int
		breakdown                               breakdownData
		topLinks                                []topLink
		wg                                      sync.WaitGroup
	)

	wg.Add(5)
	go func() { defer wg.Done(); totalClicks, avgDailyClicks, clickDelta = fetchClickStats(db, uid) }()
	go func() { defer wg.Done(); totalLinks, activeLinks = fetchLinkStats(db, uid) }()
	go func() { defer wg.Done(); uniqueVisitors = fetchUniqueVisitors(db, uid) }()
	go func() { defer wg.Done(); breakdown = fetchBreakdown(db, uid) }()
	go func() { defer wg.Done(); topLinks = fetchTopLinks(db, uid) }()
	wg.Wait()

	return e.JSON(200, response{
		TotalClicks:    totalClicks,
		ActiveLinks:    activeLinks,
		TotalLinks:     totalLinks,
		UniqueVisitors: uniqueVisitors,
		AvgDailyClicks: avgDailyClicks,
		ClickDelta:     clickDelta,
		Breakdown:      breakdown,
		TopLinks:       topLinks,
	})
}
