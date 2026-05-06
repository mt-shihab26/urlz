package overview

import (
	"math"

	"github.com/pocketbase/dbx"
)

func fetchTotalClicks(db dbx.Builder, uid string) int {
	type countRow struct {
		Count int `db:"count"`
	}
	var row countRow
	if err := db.NewQuery("SELECT COUNT(*) as count FROM clicks WHERE user = {:u}").
		Bind(dbx.Params{"u": uid}).One(&row); err != nil {
		return 0
	}
	return row.Count
}

func fetchLinkStats(db dbx.Builder, uid string) (total int, active int) {
	type linkStatRow struct {
		Status string `db:"status"`
		Count  int    `db:"count"`
	}
	var rows []linkStatRow
	if err := db.NewQuery("SELECT status, COUNT(*) as count FROM links WHERE user = {:u} GROUP BY status").
		Bind(dbx.Params{"u": uid}).All(&rows); err != nil {
		return
	}
	for _, ls := range rows {
		total += ls.Count
		if ls.Status == "active" {
			active = ls.Count
		}
	}
	return
}

func fetchUniqueVisitors(db dbx.Builder, uid string) int {
	type countRow struct {
		Count int `db:"count"`
	}
	var row countRow
	if err := db.NewQuery("SELECT COUNT(DISTINCT ip) as count FROM clicks WHERE user = {:u} AND ip != ''").
		Bind(dbx.Params{"u": uid}).One(&row); err != nil {
		return 0
	}
	return row.Count
}

func fetchClickSeries(db dbx.Builder, uid string, totalClicks int) (avgDailyClicks int, clickDelta int) {
	type seriesRow struct {
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var series []seriesRow
	if err := db.NewQuery("SELECT date, COUNT(*) as clicks FROM clicks WHERE user = {:u} GROUP BY date ORDER BY date").
		Bind(dbx.Params{"u": uid}).All(&series); err != nil {
		return
	}

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
		clickDelta = int(math.Round(float64(curr30-prev30) / float64(prev30) * 100))
	}

	activeDays := 0
	for _, s := range series {
		if s.Clicks > 0 {
			activeDays++
		}
	}
	if activeDays > 0 {
		avgDailyClicks = int(math.Round(float64(totalClicks) / float64(activeDays)))
	}
	return
}
