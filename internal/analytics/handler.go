package analytics

import (
	"fmt"
	"math"
	"strings"
	"sync"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
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

type breakdownEntry struct {
	Label string  `json:"label"`
	Pct   float64 `json:"pct"`
}

type breakdownData struct {
	Countries []breakdownEntry `json:"countries"`
	Devices   []breakdownEntry `json:"devices"`
	Referrers []breakdownEntry `json:"referrers"`
	Browsers  []breakdownEntry `json:"browsers"`
	OS        []breakdownEntry `json:"os"`
	Languages []breakdownEntry `json:"languages"`
}

type expiringLink struct {
	ID      string `db:"id" json:"id"`
	Title   string `db:"title" json:"title"`
	Code    string `db:"code" json:"code"`
	Expires string `db:"expires" json:"expires"`
}

type noClickLink struct {
	ID      string `db:"id" json:"id"`
	Title   string `db:"title" json:"title"`
	Code    string `db:"code" json:"code"`
	Created string `db:"created" json:"created"`
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
	TotalClicks int        `json:"total_clicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

type linkCounts struct {
	Total    int `db:"total"`
	Active   int `db:"active"`
	Disabled int `db:"disabled"`
	Expired  int `db:"expired"`
}

type response struct {
	Stats        statsData      `json:"stats"`
	Volume       []volumeDay    `json:"volume"`
	Breakdown    breakdownData  `json:"breakdown"`
	ExpiringSoon []expiringLink `json:"expiring_soon"`
	NoClicks     []noClickLink  `json:"no_clicks"`
	TopLinks     []topLink      `json:"top_links"`
}

func startDate(rangeParam string) string {
	days := map[string]int{"7d": 7, "30d": 30, "90d": 90}
	d, ok := days[rangeParam]
	if !ok {
		return ""
	}
	return time.Now().AddDate(0, 0, -d).Format("2006-01-02")
}

func Handler(e *core.RequestEvent) error {
	user := e.Auth
	if user == nil {
		return apis.NewUnauthorizedError("unauthorized", nil)
	}
	uid := user.Id
	db := e.App.DB()
	since := startDate(e.Request.URL.Query().Get("range"))

	var (
		volume       []volumeDay
		uv           int
		lc           linkCounts
		breakdown    breakdownData
		expiringSoon []expiringLink
		noClicks     []noClickLink
		topLinks     []topLink
		wg           sync.WaitGroup
	)

	wg.Add(7)
	go func() { defer wg.Done(); volume = fetchVolume(db, uid, since) }()
	go func() { defer wg.Done(); uv = fetchUniqueVisitors(db, uid, since) }()
	go func() { defer wg.Done(); lc = fetchLinkCounts(db, uid, since) }()
	go func() { defer wg.Done(); breakdown = fetchBreakdown(db, uid, since) }()
	go func() { defer wg.Done(); expiringSoon = fetchExpiringSoon(db, uid) }()
	go func() { defer wg.Done(); noClicks = fetchNoClicks(db, uid, since) }()
	go func() { defer wg.Done(); topLinks = fetchTopLinks(db, uid, since) }()
	wg.Wait()

	return e.JSON(200, response{
		Stats:        buildStats(volume, uv, lc),
		Volume:       volume,
		Breakdown:    breakdown,
		ExpiringSoon: expiringSoon,
		NoClicks:     noClicks,
		TopLinks:     topLinks,
	})
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
		result[i] = volumeDay{Date: r.Date, Clicks: r.Clicks}
	}
	return result
}

func fetchUniqueVisitors(db dbx.Builder, uid, since string) int {
	type row struct{ Count int `db:"count"` }
	var r row
	q := "SELECT COUNT(DISTINCT ip) as count FROM clicks WHERE user = {:u} AND ip != ''"
	params := dbx.Params{"u": uid}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	db.NewQuery(q).Bind(params).One(&r)
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
	db.NewQuery(q).Bind(params).One(&lc)
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

func fetchBreakdown(db dbx.Builder, uid, since string) breakdownData {
	topN := func(field, filterField string) []breakdownEntry {
		type row struct {
			Label string  `db:"label"`
			Pct   float64 `db:"pct"`
		}
		var rows []row
		params := dbx.Params{"u": uid}
		q := fmt.Sprintf(
			`SELECT %s as label, ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as pct
			FROM clicks WHERE user = {:u} AND %s != ''`,
			field, filterField,
		)
		if since != "" {
			q += " AND date >= {:since}"
			params["since"] = since
		}
		q += fmt.Sprintf(" GROUP BY %s ORDER BY COUNT(*) DESC LIMIT 6", field)
		if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
			return []breakdownEntry{}
		}
		out := make([]breakdownEntry, len(rows))
		for i, r := range rows {
			out[i] = breakdownEntry{Label: r.Label, Pct: r.Pct}
		}
		return out
	}

	topCountries := func() []breakdownEntry {
		type row struct {
			Label string  `db:"label"`
			Pct   float64 `db:"pct"`
		}
		var rows []row
		params := dbx.Params{"u": uid}
		q := `SELECT country_name as label, ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as pct
			FROM clicks WHERE user = {:u} AND country_code != ''`
		if since != "" {
			q += " AND date >= {:since}"
			params["since"] = since
		}
		q += " GROUP BY country_code ORDER BY COUNT(*) DESC LIMIT 6"
		if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
			return []breakdownEntry{}
		}
		out := make([]breakdownEntry, len(rows))
		for i, r := range rows {
			out[i] = breakdownEntry{Label: r.Label, Pct: r.Pct}
		}
		return out
	}

	var (
		bd breakdownData
		wg sync.WaitGroup
	)
	wg.Add(6)
	go func() { defer wg.Done(); bd.Countries = topCountries() }()
	go func() { defer wg.Done(); bd.Devices = topN("device", "device") }()
	go func() { defer wg.Done(); bd.Referrers = topN("referrer", "referrer") }()
	go func() { defer wg.Done(); bd.Browsers = topN("browser", "browser") }()
	go func() { defer wg.Done(); bd.OS = topN("os", "os") }()
	go func() { defer wg.Done(); bd.Languages = topN("language", "language") }()
	wg.Wait()
	return bd
}

func fetchExpiringSoon(db dbx.Builder, uid string) []expiringLink {
	var rows []expiringLink
	q := `SELECT id, title, code, expires FROM links WHERE user = {:u}
		AND expires != '' AND expires > datetime('now') AND expires <= datetime('now', '+30 days')
		ORDER BY expires ASC`
	if err := db.NewQuery(q).Bind(dbx.Params{"u": uid}).All(&rows); err != nil || len(rows) == 0 {
		return []expiringLink{}
	}
	return rows
}

func fetchNoClicks(db dbx.Builder, uid, since string) []noClickLink {
	var rows []noClickLink
	params := dbx.Params{"u": uid}
	q := `SELECT l.id, l.title, l.code, l.created FROM links l
		WHERE l.user = {:u} AND l.status = 'active' AND (l.expires = '' OR l.expires > datetime('now'))`
	if since != "" {
		q += " AND l.created >= {:since}"
		params["since"] = since
	}
	q += " AND l.id NOT IN (SELECT DISTINCT link FROM clicks WHERE user = {:u}"
	if since != "" {
		q += " AND date >= {:since}"
	}
	q += ") ORDER BY l.created DESC"
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []noClickLink{}
	}
	return rows
}

func fetchTopLinks(db dbx.Builder, uid, since string) []topLink {
	type topRow struct {
		ID          string `db:"id"`
		Code        string `db:"code"`
		URL         string `db:"url"`
		Title       string `db:"title"`
		Status      string `db:"status"`
		TotalClicks int    `db:"total_clicks"`
	}

	joinCond := "c.link = l.id"
	if since != "" {
		joinCond += fmt.Sprintf(" AND c.date >= '%s'", strings.ReplaceAll(since, "'", "''"))
	}

	var rows []topRow
	if err := db.NewQuery(fmt.Sprintf(`
		SELECT l.id, l.code, l.url, l.title, l.status, COUNT(c.id) as total_clicks
		FROM links l LEFT JOIN clicks c ON %s
		WHERE l.user = {:u}
		GROUP BY l.id ORDER BY total_clicks DESC LIMIT 10
	`, joinCond)).Bind(dbx.Params{"u": uid}).All(&rows); err != nil || len(rows) == 0 {
		return []topLink{}
	}

	ids := make([]string, len(rows))
	for i, r := range rows {
		ids[i] = "'" + strings.ReplaceAll(r.ID, "'", "''") + "'"
	}

	type sparkRow struct {
		Link   string `db:"link"`
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	sparkQ := fmt.Sprintf(
		"SELECT link, date, COUNT(*) as clicks FROM clicks WHERE link IN (%s)",
		strings.Join(ids, ","),
	)
	if since != "" {
		sparkQ += fmt.Sprintf(" AND date >= '%s'", strings.ReplaceAll(since, "'", "''"))
	}
	sparkQ += " GROUP BY link, date ORDER BY link, date"

	var sparkRows []sparkRow
	db.NewQuery(sparkQ).All(&sparkRows)

	sparkMap := make(map[string][]clickDay)
	for _, sr := range sparkRows {
		sparkMap[sr.Link] = append(sparkMap[sr.Link], clickDay{Date: sr.Date, Clicks: sr.Clicks})
	}

	result := make([]topLink, len(rows))
	for i, r := range rows {
		s := sparkMap[r.ID]
		if len(s) > 14 {
			s = s[len(s)-14:]
		}
		if s == nil {
			s = []clickDay{}
		}
		result[i] = topLink{
			ID: r.ID, Code: r.Code, URL: r.URL, Title: r.Title,
			Status: r.Status, TotalClicks: r.TotalClicks, Sparkline: s,
		}
	}
	return result
}
