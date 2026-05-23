package show

import (
	"strconv"
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type showResponse struct {
	Link             linkData      `json:"link"`
	Stats            statsData     `json:"stats"`
	Volume           []volumeDay   `json:"volume"`
	Breakdown        breakdownData `json:"breakdown"`
	Clicks           []clickRecord `json:"clicks"`
	ClicksTotalItems int           `json:"clicks_total_items"`
	ClicksTotalPages int           `json:"clicks_total_pages"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	linkID := e.Request.PathValue("id")
	db := e.App.DB()
	q := e.Request.URL.Query()

	since := startDate(q.Get("range"))
	page, _ := strconv.Atoi(q.Get("page"))
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * perPage

	link, err := fetchLink(db, linkID, uid)
	if err != nil {
		return apis.NewNotFoundError("link not found", nil)
	}

	var (
		stats       statsData
		volume      []volumeDay
		breakdown   breakdownData
		clicks      []clickRecord
		clicksTotal int
		wg          sync.WaitGroup
	)
	wg.Go(func() { stats = fetchStats(db, linkID, since) })
	wg.Go(func() { volume = fetchVolume(db, linkID, since) })
	wg.Go(func() { breakdown = fetchBreakdown(db, linkID, since) })
	wg.Go(func() { clicks = fetchClicks(db, linkID, since, perPage, offset) })
	wg.Go(func() { clicksTotal = fetchClicksTotal(db, linkID, since) })
	wg.Wait()

	totalPages := clicksTotal / perPage
	if clicksTotal%perPage != 0 {
		totalPages++
	}
	if totalPages < 1 {
		totalPages = 1
	}

	return e.JSON(200, showResponse{
		Link:             link,
		Stats:            stats,
		Volume:           volume,
		Breakdown:        breakdown,
		Clicks:           clicks,
		ClicksTotalItems: clicksTotal,
		ClicksTotalPages: totalPages,
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
