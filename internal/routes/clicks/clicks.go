package clicks

import (
	"fmt"

	"github.com/pocketbase/dbx"
)

type clickItem struct {
	ID          string `db:"id"           json:"id"`
	Date        string `db:"date"         json:"date"`
	Link        string `db:"link"         json:"link"`
	LinkTitle   string `db:"link_title"   json:"link_title"`
	LinkCode    string `db:"link_code"    json:"link_code"`
	LinkURL     string `db:"link_url"     json:"link_url"`
	CountryName string `db:"country_name" json:"country_name"`
	CountryCode string `db:"country_code" json:"country_code"`
	City        string `db:"city"         json:"city"`
	Region      string `db:"region"       json:"region"`
	Timezone    string `db:"timezone"     json:"timezone"`
	Referrer    string `db:"referrer"     json:"referrer"`
	Browser     string `db:"browser"      json:"browser"`
	OS          string `db:"os"           json:"os"`
	Device      string `db:"device"       json:"device"`
	Language    string `db:"language"     json:"language"`
	IP          string `db:"ip"           json:"ip"`
	UserAgent   string `db:"user_agent"   json:"user_agent"`
}

func fetchClicks(db dbx.Builder, uid, since string, limit, offset int) []clickItem {
	q := `
		SELECT c.id, c.date, c.link,
		       COALESCE(l.title, '') as link_title,
		       COALESCE(l.code, '')  as link_code,
		       COALESCE(l.url, '')   as link_url,
		       c.country_name, c.country_code, c.city, c.region, c.timezone,
		       c.referrer, c.browser, c.os, c.device, c.language, c.ip, c.user_agent
		FROM clicks c
		LEFT JOIN links l ON l.id = c.link
		WHERE c.user = {:u}`
	params := dbx.Params{"u": uid, "limit": limit, "offset": offset}
	if since != "" {
		q += " AND c.date >= {:since}"
		params["since"] = since
	}
	q += fmt.Sprintf(" ORDER BY c.created DESC LIMIT %d OFFSET %d", limit, offset)
	var rows []clickItem
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []clickItem{}
	}
	return rows
}

func fetchTotal(db dbx.Builder, uid, since string) int {
	type row struct {
		Count int `db:"count"`
	}
	q := "SELECT COUNT(*) as count FROM clicks WHERE user = {:u}"
	params := dbx.Params{"u": uid}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	var r row
	if err := db.NewQuery(q).Bind(params).One(&r); err != nil {
		return 0
	}
	return r.Count
}
