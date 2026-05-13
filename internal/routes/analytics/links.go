package analytics

import "github.com/pocketbase/dbx"

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
