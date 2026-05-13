package show

import (
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type showResponse struct {
	Link      linkData      `json:"link"`
	Stats     statsData     `json:"stats"`
	Volume    []volumeDay   `json:"volume"`
	Breakdown breakdownData `json:"breakdown"`
	Clicks    []clickRecord `json:"clicks"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	linkID := e.Request.PathValue("id")
	db := e.App.DB()
	since := startDate(e.Request.URL.Query().Get("range"))

	link, err := fetchLink(db, linkID, uid)
	if err != nil {
		return apis.NewNotFoundError("link not found", nil)
	}

	var (
		stats     statsData
		volume    []volumeDay
		breakdown breakdownData
		clicks    []clickRecord
		wg        sync.WaitGroup
	)
	wg.Go(func() { stats = fetchStats(db, linkID, since) })
	wg.Go(func() { volume = fetchVolume(db, linkID, since) })
	wg.Go(func() { breakdown = fetchBreakdown(db, linkID, since) })
	wg.Go(func() { clicks = fetchClicks(db, linkID, since) })
	wg.Wait()

	return e.JSON(200, showResponse{
		Link:      link,
		Stats:     stats,
		Volume:    volume,
		Breakdown: breakdown,
		Clicks:    clicks,
	})
}

func startDate(rangeParam string) string {
	days := map[string]int{"7d": 7, "30d": 30, "90d": 90}
	d, ok := days[rangeParam]
	if !ok {
		return ""
	}
	return time.Now().AddDate(0, 0, -d).Format("2006-01-02")
}
