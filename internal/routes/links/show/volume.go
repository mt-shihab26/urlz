package show

import "github.com/pocketbase/dbx"

type volumeDay struct {
	Date   string `db:"date"   json:"date"`
	Clicks int    `db:"clicks" json:"clicks"`
}

func fetchVolume(db dbx.Builder, linkID, since string) []volumeDay {
	q := "SELECT date, COUNT(*) as clicks FROM clicks WHERE link = {:id}"
	params := dbx.Params{"id": linkID}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	q += " GROUP BY date ORDER BY date"
	var rows []volumeDay
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []volumeDay{}
	}
	return rows
}
