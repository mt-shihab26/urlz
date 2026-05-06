package overview

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	userID := user.Id
	db := e.App.DB()
	totalClicks := fetchTotalClicks(db, userID)
	totalLinks, activeLinks := fetchLinkStats(db, userID)
	uniqueVisitors := fetchUniqueVisitors(db, userID)
	avgDailyClicks, clickDelta := fetchClickSeries(db, userID, totalClicks)
	breakdown := fetchBreakdown(db, userID)
	topLinks := fetchTopLinks(db, userID)
	data := struct {
		TotalClicks    int           `json:"total_clicks"`
		ActiveLinks    int           `json:"active_links"`
		TotalLinks     int           `json:"total_links"`
		UniqueVisitors int           `json:"unique_visitors"`
		AvgDailyClicks int           `json:"avg_daily_clicks"`
		ClickDelta     int           `json:"click_delta"`
		Breakdown      breakdownData `json:"breakdown"`
		TopLinks       []topLink     `json:"top_links"`
	}{
		TotalClicks:    totalClicks,
		ActiveLinks:    activeLinks,
		TotalLinks:     totalLinks,
		UniqueVisitors: uniqueVisitors,
		AvgDailyClicks: avgDailyClicks,
		ClickDelta:     clickDelta,
		Breakdown:      breakdown,
		TopLinks:       topLinks,
	}
	return e.JSON(200, data)
}
