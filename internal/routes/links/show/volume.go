package show

import "github.com/pocketbase/dbx"

type volumeDay struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

func fetchVolume(db dbx.Builder, linkID, since string) []volumeDay {
	type row struct {
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	q := "SELECT date, COUNT(*) as clicks FROM clicks WHERE link = {:id}"
	params := dbx.Params{"id": linkID}
	if since != "" {
		q += " AND date >= {:since}"
		params["since"] = since
	}
	q += " GROUP BY date ORDER BY date"
	var rows []row
	if err := db.NewQuery(q).Bind(params).All(&rows); err != nil || len(rows) == 0 {
		return []volumeDay{}
	}
	result := make([]volumeDay, len(rows))
	for i, r := range rows {
		result[i] = volumeDay(r)
	}
	return result
}
