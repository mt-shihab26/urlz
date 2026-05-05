package overview

import (
	"fmt"
	"math"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type breakdownItem struct {
	Label string `json:"label"`
	Count int    `json:"count"`
}

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
	TotalClicks int        `json:"totalClicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

type breakdownData struct {
	Countries []breakdownItem `json:"countries"`
	Devices   []breakdownItem `json:"devices"`
	Referrers []breakdownItem `json:"referrers"`
	Browsers  []breakdownItem `json:"browsers"`
	OS        []breakdownItem `json:"os"`
	Languages []breakdownItem `json:"languages"`
}

type overviewResponse struct {
	TotalClicks    int           `json:"totalClicks"`
	ActiveLinks    int           `json:"activeLinks"`
	TotalLinks     int           `json:"totalLinks"`
	UniqueVisitors int           `json:"uniqueVisitors"`
	AvgDailyClicks int           `json:"avgDailyClicks"`
	ClickDelta     int           `json:"clickDelta"`
	Breakdown      breakdownData `json:"breakdown"`
	TopLinks       []topLink     `json:"topLinks"`
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()

	resp := overviewResponse{
		TopLinks: []topLink{},
	}

	type countRow struct {
		Count int `db:"count"`
	}

	var totalRow countRow
	if err := db.NewQuery("SELECT COUNT(*) as count FROM clicks WHERE user = {:u}").
		Bind(dbx.Params{"u": uid}).One(&totalRow); err == nil {
		resp.TotalClicks = totalRow.Count
	}

	type linkStatRow struct {
		Status string `db:"status"`
		Count  int    `db:"count"`
	}
	var linkStats []linkStatRow
	if err := db.NewQuery("SELECT status, COUNT(*) as count FROM links WHERE user = {:u} GROUP BY status").
		Bind(dbx.Params{"u": uid}).All(&linkStats); err == nil {
		for _, ls := range linkStats {
			resp.TotalLinks += ls.Count
			if ls.Status == "active" {
				resp.ActiveLinks = ls.Count
			}
		}
	}

	var uniqueRow countRow
	if err := db.NewQuery("SELECT COUNT(DISTINCT ip) as count FROM clicks WHERE user = {:u} AND ip != ''").
		Bind(dbx.Params{"u": uid}).One(&uniqueRow); err == nil {
		resp.UniqueVisitors = uniqueRow.Count
	}

	type seriesRow struct {
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var series []seriesRow
	if err := db.NewQuery("SELECT date, COUNT(*) as clicks FROM clicks WHERE user = {:u} GROUP BY date ORDER BY date").
		Bind(dbx.Params{"u": uid}).All(&series); err == nil {
		n := len(series)
		var prev30, curr30 int
		for i, s := range series {
			if i >= n-60 && i < n-30 {
				prev30 += s.Clicks
			}
			if i >= n-30 {
				curr30 += s.Clicks
			}
		}
		if prev30 > 0 {
			resp.ClickDelta = int(math.Round(float64(curr30-prev30) / float64(prev30) * 100))
		}
		activeDays := 0
		for _, s := range series {
			if s.Clicks > 0 {
				activeDays++
			}
		}
		if activeDays > 0 {
			resp.AvgDailyClicks = int(math.Round(float64(resp.TotalClicks) / float64(activeDays)))
		}
	}

	topN := func(field string) []breakdownItem {
		type row struct {
			Label string `db:"label"`
			Count int    `db:"count"`
		}
		var rows []row
		q := fmt.Sprintf(
			"SELECT %s as label, COUNT(*) as count FROM clicks WHERE user = {:u} AND %s != '' GROUP BY %s ORDER BY count DESC LIMIT 5",
			field, field, field,
		)
		if err := db.NewQuery(q).Bind(dbx.Params{"u": uid}).All(&rows); err != nil {
			return []breakdownItem{}
		}
		items := make([]breakdownItem, len(rows))
		for i, r := range rows {
			items[i] = breakdownItem{Label: r.Label, Count: r.Count}
		}
		return items
	}

	resp.Breakdown = breakdownData{
		Countries: topN("country_name"),
		Devices:   topN("device"),
		Referrers: topN("referrer"),
		Browsers:  topN("browser"),
		OS:        topN("os"),
		Languages: topN("language"),
	}

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
	`).Bind(dbx.Params{"u": uid}).All(&topRows); err == nil && len(topRows) > 0 {
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

		resp.TopLinks = make([]topLink, len(topRows))
		for i, r := range topRows {
			s := sparkMap[r.ID]
			if len(s) > 14 {
				s = s[len(s)-14:]
			}
			if s == nil {
				s = []clickDay{}
			}
			resp.TopLinks[i] = topLink{
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
	}

	return e.JSON(200, resp)
}
