package analytics

import (
	"math"

	"github.com/pocketbase/dbx"
)

type statsData struct {
	TotalClicks      int `json:"total_clicks"`
	TotalLinks       int `json:"total_links"`
	ActiveLinks      int `json:"active_links"`
	DisabledLinks    int `json:"disabled_links"`
	ExpiredLinks     int `json:"expired_links"`
	UniqueVisitors   int `json:"unique_visitors"`
	AvgDailyClicks   int `json:"avg_daily_clicks"`
	PeakDay          int `json:"peak_day"`
	ClickDelta       int `json:"click_delta"`
	AvgClicksPerLink int `json:"avg_clicks_per_link"`
}

type volumeDay struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

type linkCounts struct {
	Total    int `db:"total"`
	Active   int `db:"active"`
	Disabled int `db:"disabled"`
	Expired  int `db:"expired"`
}

func fetchVolume(db dbx.Builder, uid, since string) []volumeDay {
	type row struct {
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var rows []row
	q := "SELECT date, COUNT(*) as clicks FROM clicks WHERE user = {:u}"
	params := dbx.Params{"u": uid}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	q += " GROUP BY date ORDER BY date"
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []volumeDay{}
	}
	result := make([]volumeDay, len(rows))
	for i, r := range rows {
		result[i] = volumeDay(r)
	}
	return result
}

func fetchUniqueVisitors(db dbx.Builder, uid, since string) int {
	type row struct {
		Count int `db:"count"`
	}
	var r row
	q := "SELECT COUNT(DISTINCT ip) as count FROM clicks WHERE user = {:u} AND ip != ''"
	params := dbx.Params{"u": uid}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	if err := db.NewQuery(q).Bind(params).One(&r); err != nil {
		return 0
	}
	return r.Count
}

func fetchLinkCounts(db dbx.Builder, uid, since string) linkCounts {
	var lc linkCounts
	q := `SELECT COUNT(*) as total,
		SUM(CASE WHEN status='active' AND (expires='' OR expires > datetime('now')) THEN 1 ELSE 0 END) as active,
		SUM(CASE WHEN status='disabled' THEN 1 ELSE 0 END) as disabled,
		SUM(CASE WHEN expires != '' AND expires < datetime('now') THEN 1 ELSE 0 END) as expired
		FROM links WHERE user = {:u}`
	params := dbx.Params{"u": uid}
	if since != "" {
		q += " AND created >= {:since}"
		params["since"] = since
	}
	if err := db.NewQuery(q).Bind(params).One(&lc); err != nil {
		return lc
	}
	return lc
}

func buildStats(volume []volumeDay, uv int, lc linkCounts) statsData {
	totalClicks, peakDay, activeDays := 0, 0, 0
	for _, v := range volume {
		totalClicks += v.Clicks
		if v.Clicks > peakDay {
			peakDay = v.Clicks
		}
		if v.Clicks > 0 {
			activeDays++
		}
	}
	avgDailyClicks := 0
	if activeDays > 0 {
		avgDailyClicks = int(math.Round(float64(totalClicks) / float64(activeDays)))
	}
	clickDelta := 0
	if n := len(volume); n > 1 {
		mid := n / 2
		first, second := 0, 0
		for i, v := range volume {
			if i < mid {
				first += v.Clicks
			} else {
				second += v.Clicks
			}
		}
		if first > 0 {
			clickDelta = int(math.Round(float64(second-first) / float64(first) * 100))
		}
	}
	avgClicksPerLink := 0
	if lc.Total > 0 {
		avgClicksPerLink = int(math.Round(float64(totalClicks) / float64(lc.Total)))
	}
	return statsData{
		TotalClicks:      totalClicks,
		TotalLinks:       lc.Total,
		ActiveLinks:      lc.Active,
		DisabledLinks:    lc.Disabled,
		ExpiredLinks:     lc.Expired,
		UniqueVisitors:   uv,
		AvgDailyClicks:   avgDailyClicks,
		PeakDay:          peakDay,
		ClickDelta:       clickDelta,
		AvgClicksPerLink: avgClicksPerLink,
	}
}
