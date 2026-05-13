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
	ID          string     `db:"id"           json:"id"`
	Code        string     `db:"code"         json:"code"`
	URL         string     `db:"url"          json:"url"`
	Title       string     `db:"title"        json:"title"`
	Status      string     `db:"status"       json:"status"`
	Created     string     `db:"created"      json:"created"`
	Updated     string     `db:"updated"      json:"updated"`
	Expires     string     `db:"expires"      json:"expires"`
	TotalClicks int        `db:"total_clicks" json:"total_clicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

func fetchTopLinks(db dbx.Builder, uid string) []topLink {
	var topRows []topLink
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
	params := dbx.Params{"u": uid}
	placeholders := make([]string, len(topRows))
	for i, r := range topRows {
		key := fmt.Sprintf("id%d", i)
		placeholders[i] = "{:" + key + "}"
		params[key] = r.ID
	}
	type sparkRow struct {
		Link   string `db:"link"`
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var sparkRows []sparkRow
	if err := db.NewQuery(fmt.Sprintf(
		"SELECT link, date, COUNT(*) as clicks FROM clicks WHERE link IN (%s) GROUP BY link, date ORDER BY link, date",
		strings.Join(placeholders, ","),
	)).Bind(params).All(&sparkRows); err != nil {
		sparkRows = nil
	}
	sparkMap := make(map[string][]clickDay)
	for _, sr := range sparkRows {
		sparkMap[sr.Link] = append(sparkMap[sr.Link], clickDay{Date: sr.Date, Clicks: sr.Clicks})
	}
	for i := range topRows {
		s := sparkMap[topRows[i].ID]
		if len(s) > 14 {
			s = s[len(s)-14:]
		}
		if s == nil {
			s = []clickDay{}
		}
		topRows[i].Sparkline = s
	}
	return topRows
}
