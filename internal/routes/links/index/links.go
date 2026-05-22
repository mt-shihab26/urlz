package index

import (
	"fmt"

	"github.com/pocketbase/dbx"
)

type linkItem struct {
	ID          string     `json:"id"`
	Code        string     `json:"code"`
	URL         string     `json:"url"`
	Title       string     `json:"title"`
	Status      string     `json:"status"`
	User        string     `json:"user"`
	Created     string     `json:"created"`
	Updated     string     `json:"updated"`
	Expires     string     `json:"expires"`
	TotalClicks int        `json:"total_clicks"`
	Sparkline   []clickDay `json:"sparkline"`
}

type linkRow struct {
	ID      string `db:"id"`
	Code    string `db:"code"`
	URL     string `db:"url"`
	Title   string `db:"title"`
	Status  string `db:"status"`
	User    string `db:"user"`
	Created string `db:"created"`
	Updated string `db:"updated"`
	Expires string `db:"expires"`
}

type linkCounts struct {
	All      int `json:"all" db:"all"`
	Active   int `json:"active" db:"active"`
	Disabled int `json:"disabled" db:"disabled"`
	Expired  int `json:"expired" db:"expired"`
}

func fetchLinkCounts(db dbx.Builder, uid string) linkCounts {
	var counts linkCounts
	_ = db.NewQuery(`
		SELECT
			COUNT(*) AS "all",
			COUNT(CASE WHEN status = 'active'   AND (expires IS NULL OR expires = '' OR datetime(expires) > datetime('now')) THEN 1 END) AS active,
			COUNT(CASE WHEN status = 'disabled' AND (expires IS NULL OR expires = '' OR datetime(expires) > datetime('now')) THEN 1 END) AS disabled,
			COUNT(CASE WHEN expires IS NOT NULL AND expires != '' AND datetime(expires) < datetime('now') THEN 1 END) AS expired
		FROM links
		WHERE user = {:u}
	`).Bind(dbx.Params{"u": uid}).One(&counts)
	return counts
}

func fetchLinkRows(db dbx.Builder, uid, filter, search string) []linkRow {
	where := "user = {:u}"
	params := dbx.Params{"u": uid}

	notExpired := "(expires IS NULL OR expires = '' OR datetime(expires) > datetime('now'))"
	isExpired := "(expires IS NOT NULL AND expires != '' AND datetime(expires) < datetime('now'))"

	switch filter {
	case "active":
		where += " AND status = 'active' AND " + notExpired
	case "disabled":
		where += " AND status = 'disabled' AND " + notExpired
	case "expired":
		where += " AND " + isExpired
	}

	if search != "" {
		where += " AND (url LIKE {:search} OR title LIKE {:search} OR code LIKE {:search})"
		params["search"] = fmt.Sprintf("%%%s%%", search)
	}

	var rows []linkRow
	_ = db.NewQuery(fmt.Sprintf(`
		SELECT id, code, url, title, status, user, created, updated, expires
		FROM links
		WHERE %s
		ORDER BY created DESC
	`, where)).Bind(params).All(&rows)
	return rows
}
