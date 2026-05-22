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

func fetchLinkRows(db dbx.Builder, uid, filter, search string) []linkRow {
	where := "user = {:u}"
	params := dbx.Params{"u": uid}

	switch filter {
	case "active", "disabled":
		where += " AND status = {:status}"
		params["status"] = filter
	case "expired":
		where += " AND expires != '' AND expires < datetime('now')"
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
