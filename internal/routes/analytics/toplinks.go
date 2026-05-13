package analytics

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
	TotalClicks int        `db:"total_clicks" json:"total_clicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

func fetchTopLinks(db dbx.Builder, uid, since string) []topLink {
	params := dbx.Params{"u": uid}
	joinCond := "c.link = l.id"
	if since != "" {
		joinCond += " AND c.date >= {:since}"
		params["since"] = since
	}
	var rows []topLink
	if err := db.NewQuery(fmt.Sprintf(`
		SELECT l.id, l.code, l.url, l.title, l.status, COUNT(c.id) as total_clicks
		FROM links l LEFT JOIN clicks c ON %s
		WHERE l.user = {:u}
		GROUP BY l.id ORDER BY total_clicks DESC LIMIT 10
	`, joinCond)).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []topLink{}
	}
	sparkParams := dbx.Params{}
	placeholders := make([]string, len(rows))
	for i, r := range rows {
		key := fmt.Sprintf("id%d", i)
		placeholders[i] = "{:" + key + "}"
		sparkParams[key] = r.ID
	}
	sparkQ := "SELECT link, date, COUNT(*) as clicks FROM clicks WHERE link IN (" + strings.Join(placeholders, ",") + ")"
	if since != "" {
		sparkQ += " AND date >= {:since}"
		sparkParams["since"] = since
	}
	sparkQ += " GROUP BY link, date ORDER BY link, date"
	type sparkRow struct {
		Link   string `db:"link"`
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var sparkRows []sparkRow
	if err := db.NewQuery(sparkQ).Bind(sparkParams).All(&sparkRows); err != nil {
		sparkRows = nil
	}
	sparkMap := make(map[string][]clickDay)
	for _, sr := range sparkRows {
		sparkMap[sr.Link] = append(sparkMap[sr.Link], clickDay{Date: sr.Date, Clicks: sr.Clicks})
	}
	for i := range rows {
		s := sparkMap[rows[i].ID]
		if len(s) > 14 {
			s = s[len(s)-14:]
		}
		if s == nil {
			s = []clickDay{}
		}
		rows[i].Sparkline = s
	}
	return rows
}
