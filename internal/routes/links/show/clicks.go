package show

import (
	"fmt"

	"github.com/pocketbase/dbx"
)

const perPage = 10

type clickRecord struct {
	ID          string `db:"id"           json:"id"`
	Date        string `db:"date"         json:"date"`
	CountryName string `db:"country_name" json:"country_name"`
	Referrer    string `db:"referrer"     json:"referrer"`
	Browser     string `db:"browser"      json:"browser"`
	OS          string `db:"os"           json:"os"`
	Device      string `db:"device"       json:"device"`
}

func fetchClicks(db dbx.Builder, linkID, since string, limit, offset int) []clickRecord {
	q := "SELECT id, date, country_name, referrer, browser, os, device FROM clicks WHERE link = {:id}"
	params := dbx.Params{"id": linkID}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	q += fmt.Sprintf(" ORDER BY created DESC LIMIT %d OFFSET %d", limit, offset)
	var rows []clickRecord
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []clickRecord{}
	}
	return rows
}

