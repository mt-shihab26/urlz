package clicks

import (
	"strconv"
	"sync"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

const perPage = 20

type response struct {
	Items      []clickItem `json:"items"`
	TotalItems int         `json:"total_items"`
	TotalPages int         `json:"total_pages"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()
	q := e.Request.URL.Query()

	since := startDate(q.Get("range"))
	page, _ := strconv.Atoi(q.Get("page"))
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * perPage

	var (
		items []clickItem
		total int
		wg    sync.WaitGroup
	)
	wg.Go(func() { items = fetchClicks(db, uid, since, perPage, offset) })
	wg.Go(func() { total = fetchTotal(db, uid, since) })
	wg.Wait()

	totalPages := total / perPage
	if total%perPage != 0 {
		totalPages++
	}
	if totalPages < 1 {
		totalPages = 1
	}

	return e.JSON(200, response{
		Items:      items,
		TotalItems: total,
		TotalPages: totalPages,
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
