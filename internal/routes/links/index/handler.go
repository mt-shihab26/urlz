package index

import (
	"sync"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type response struct {
	Links []linkItem `json:"links"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()
	filter := e.Request.URL.Query().Get("filter")
	search := e.Request.URL.Query().Get("search")
	return e.JSON(200, response{Links: buildLinks(db, uid, filter, search)})
}

func buildLinks(db dbx.Builder, uid, filter, search string) []linkItem {
	rows := fetchLinkRows(db, uid, filter, search)
	if len(rows) == 0 {
		return []linkItem{}
	}

	ids := make([]string, len(rows))
	for i, r := range rows {
		ids[i] = r.ID
	}

	var (
		clickCounts map[string]int
		sparkMap    map[string][]clickDay
		wg          sync.WaitGroup
	)
	wg.Go(func() { clickCounts = fetchClickCounts(db, ids) })
	wg.Go(func() { sparkMap = fetchSparklines(db, ids) })
	wg.Wait()

	result := make([]linkItem, len(rows))
	for i, r := range rows {
		s := sparkMap[r.ID]
		if s == nil {
			s = []clickDay{}
		}
		result[i] = linkItem{
			ID:          r.ID,
			Code:        r.Code,
			URL:         r.URL,
			Title:       r.Title,
			Status:      r.Status,
			User:        r.User,
			Created:     r.Created,
			Updated:     r.Updated,
			Expires:     r.Expires,
			TotalClicks: clickCounts[r.ID],
			Sparkline:   s,
		}
	}
	return result
}
