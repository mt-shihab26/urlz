package overview

import (
	"fmt"
	"strings"

	"github.com/pocketbase/dbx"
)

type clickDay struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

type topLink struct {
	ID          string     `json:"id"`
	Code        string     `json:"code"`
	URL         string     `json:"url"`
	Title       string     `json:"title"`
	Status      string     `json:"status"`
	Created     string     `json:"created"`
	Updated     string     `json:"updated"`
	Expires     string     `json:"expires"`
	TotalClicks int        `json:"total_clicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

func fetchTopLinks(db dbx.Builder, uid string) []topLink {
	type topLinkRow struct {
		ID          string `db:"id"`
		Code        string `db:"code"`
		URL         string `db:"url"`
		Title       string `db:"title"`
		Status      string `db:"status"`
		Created     string `db:"created"`
		Updated     string `db:"updated"`
		Expires     string `db:"expires"`
		TotalClicks int    `db:"total_clicks"`
	}
	var topRows []topLinkRow
	if err := db.NewQuery(`
		SELECT l.id, l.code, l.url, l.title, l.status, l.created, l.updated, l.expires,
		       COUNT(c.id) as total_clicks
		FROM links l
		LEFT JOIN clicks c ON c.link = l.id
		WHERE l.user = {:u}
		GROUP BY l.id
		ORDER BY total_clicks DESC
		LIMIT 6
	`).Bind(dbx.Params{"u": uid}).All(&topRows); err != nil || len(topRows) == 0 {
		return []topLink{}
	}
	ids := make([]string, len(topRows))
	for i, r := range topRows {
		ids[i] = "'" + strings.ReplaceAll(r.ID, "'", "''") + "'"
	}
	type sparkRow struct {
		Link   string `db:"link"`
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var sparkRows []sparkRow
	db.NewQuery(fmt.Sprintf(
		"SELECT link, date, COUNT(*) as clicks FROM clicks WHERE link IN (%s) GROUP BY link, date ORDER BY link, date",
		strings.Join(ids, ","),
	)).All(&sparkRows)
	sparkMap := make(map[string][]clickDay)
	for _, sr := range sparkRows {
		sparkMap[sr.Link] = append(sparkMap[sr.Link], clickDay{Date: sr.Date, Clicks: sr.Clicks})
	}
	links := make([]topLink, len(topRows))
	for i, r := range topRows {
		s := sparkMap[r.ID]
		if len(s) > 14 {
			s = s[len(s)-14:]
		}
		if s == nil {
			s = []clickDay{}
		}
		links[i] = topLink{
			ID:          r.ID,
			Code:        r.Code,
			URL:         r.URL,
			Title:       r.Title,
			Status:      r.Status,
			Created:     r.Created,
			Updated:     r.Updated,
			Expires:     r.Expires,
			TotalClicks: r.TotalClicks,
			Sparkline:   s,
		}
	}
	return links
}
