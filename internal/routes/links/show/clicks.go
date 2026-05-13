package show

import "github.com/pocketbase/dbx"

type clickRecord struct {
	ID          string `db:"id"           json:"id"`
	Date        string `db:"date"         json:"date"`
	CountryName string `db:"country_name" json:"country_name"`
	Referrer    string `db:"referrer"     json:"referrer"`
	Browser     string `db:"browser"      json:"browser"`
	OS          string `db:"os"           json:"os"`
	Device      string `db:"device"       json:"device"`
}

func fetchClicks(db dbx.Builder, linkID, since string) []clickRecord {
	q := "SELECT id, date, country_name, referrer, browser, os, device FROM clicks WHERE link = {:id}"
	params := dbx.Params{"id": linkID}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	q += " ORDER BY created DESC"
	var rows []clickRecord
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []clickRecord{}
	}
	return rows
}
