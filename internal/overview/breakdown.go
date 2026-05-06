package overview

import (
	"fmt"

	"github.com/pocketbase/dbx"
)

func fetchBreakdown(db dbx.Builder, uid string) breakdownData {
	topN := func(field string) []breakdownItem {
		type row struct {
			Label string `db:"label"`
			Count int    `db:"count"`
		}
		var rows []row
		q := fmt.Sprintf(
			"SELECT %s as label, COUNT(*) as count FROM clicks WHERE user = {:u} AND %s != '' GROUP BY %s ORDER BY count DESC LIMIT 5",
			field, field, field,
		)
		if err := db.NewQuery(q).Bind(dbx.Params{"u": uid}).All(&rows); err != nil {
			return []breakdownItem{}
		}
		items := make([]breakdownItem, len(rows))
		for i, r := range rows {
			items[i] = breakdownItem{Label: r.Label, Count: r.Count}
		}
		return items
	}

	return breakdownData{
		Countries: topN("country_name"),
		Devices:   topN("device"),
		Referrers: topN("referrer"),
		Browsers:  topN("browser"),
		OS:        topN("os"),
		Languages: topN("language"),
	}
}
