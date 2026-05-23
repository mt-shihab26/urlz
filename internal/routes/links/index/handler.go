package index

import (
	"strconv"
	"sync"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type response struct {
	Links      []linkItem `json:"links"`
	Counts     linkCounts `json:"counts"`
	TotalItems int        `json:"total_items"`
	TotalPages int        `json:"total_pages"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()
	q := e.Request.URL.Query()
	filter := q.Get("filter")
	search := q.Get("search")
	page := 1
	if p, err := strconv.Atoi(q.Get("page")); err == nil && p > 0 {
		page = p
	}

	var (
		links      []linkItem
		counts     linkCounts
		totalItems int
		wg         sync.WaitGroup
	)
	wg.Go(func() { links = buildLinks(db, uid, filter, search, page) })
	wg.Go(func() { counts = fetchLinkCounts(db, uid) })
	needsCount := filter != "" || search != ""
	if needsCount {
		wg.Go(func() { totalItems = fetchFilteredCount(db, uid, filter, search) })
	}
	wg.Wait()
	if !needsCount {
		totalItems = counts.All
	}

	totalPages := (totalItems + perPage - 1) / perPage
	if totalPages == 0 {
		totalPages = 1
	}

	return e.JSON(200, response{
		Links:      links,
		Counts:     counts,
		TotalItems: totalItems,
		TotalPages: totalPages,
	})
}

func buildLinks(db dbx.Builder, uid, filter, search string, page int) []linkItem {
	rows := fetchLinkRows(db, uid, filter, search, page)
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
