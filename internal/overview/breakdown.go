package overview

import (
	"fmt"
	"sync"

	"github.com/pocketbase/dbx"
)

type breakdownItem struct {
	Label string `json:"label"`
	Count int    `json:"count"`
}

type breakdownData struct {
	Countries []breakdownItem `json:"countries"`
	Devices   []breakdownItem `json:"devices"`
	Referrers []breakdownItem `json:"referrers"`
	Browsers  []breakdownItem `json:"browsers"`
	OS        []breakdownItem `json:"os"`
	Languages []breakdownItem `json:"languages"`
}

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

	var (
		bd breakdownData
		wg sync.WaitGroup
	)
	wg.Add(6)
	go func() { defer wg.Done(); bd.Countries = topN("country_name") }()
	go func() { defer wg.Done(); bd.Devices = topN("device") }()
	go func() { defer wg.Done(); bd.Referrers = topN("referrer") }()
	go func() { defer wg.Done(); bd.Browsers = topN("browser") }()
	go func() { defer wg.Done(); bd.OS = topN("os") }()
	go func() { defer wg.Done(); bd.Languages = topN("language") }()
	wg.Wait()
	return bd
}
