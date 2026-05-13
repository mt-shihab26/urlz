package links

import "github.com/pocketbase/dbx"

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

func fetchLinkRows(db dbx.Builder, uid string) []linkRow {
	var rows []linkRow
	_ = db.NewQuery(`
		SELECT id, code, url, title, status, user, created, updated, expires
		FROM links
		WHERE user = {:u}
		ORDER BY created DESC
	`).Bind(dbx.Params{"u": uid}).All(&rows)
	return rows
}
