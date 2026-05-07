package overview

import (
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
	type row struct {
		Field string `db:"field"`
		Label string `db:"label"`
		Count int    `db:"count"`
	}
	var rows []row
	db.NewQuery(`
		WITH
		  countries AS (SELECT country_name AS label, COUNT(*) AS count FROM clicks WHERE user = {:u} AND country_name != '' GROUP BY country_name ORDER BY count DESC LIMIT 5),
		  devices   AS (SELECT device,               COUNT(*) AS count FROM clicks WHERE user = {:u} AND device        != '' GROUP BY device        ORDER BY count DESC LIMIT 5),
		  referrers AS (SELECT referrer,             COUNT(*) AS count FROM clicks WHERE user = {:u} AND referrer      != '' GROUP BY referrer      ORDER BY count DESC LIMIT 5),
		  browsers  AS (SELECT browser,              COUNT(*) AS count FROM clicks WHERE user = {:u} AND browser       != '' GROUP BY browser       ORDER BY count DESC LIMIT 5),
		  os        AS (SELECT os,                   COUNT(*) AS count FROM clicks WHERE user = {:u} AND os            != '' GROUP BY os            ORDER BY count DESC LIMIT 5),
		  languages AS (SELECT language,             COUNT(*) AS count FROM clicks WHERE user = {:u} AND language      != '' GROUP BY language      ORDER BY count DESC LIMIT 5)
		SELECT 'country'  AS field, label, count FROM countries
		UNION ALL
		SELECT 'device',            label, count FROM devices
		UNION ALL
		SELECT 'referrer',          label, count FROM referrers
		UNION ALL
		SELECT 'browser',           label, count FROM browsers
		UNION ALL
		SELECT 'os',                label, count FROM os
		UNION ALL
		SELECT 'language',          label, count FROM languages
	`).Bind(dbx.Params{"u": uid}).All(&rows)

	bd := breakdownData{
		Countries: []breakdownItem{},
		Devices:   []breakdownItem{},
		Referrers: []breakdownItem{},
		Browsers:  []breakdownItem{},
		OS:        []breakdownItem{},
		Languages: []breakdownItem{},
	}
	for _, r := range rows {
		item := breakdownItem{Label: r.Label, Count: r.Count}
		switch r.Field {
		case "country":
			bd.Countries = append(bd.Countries, item)
		case "device":
			bd.Devices = append(bd.Devices, item)
		case "referrer":
			bd.Referrers = append(bd.Referrers, item)
		case "browser":
			bd.Browsers = append(bd.Browsers, item)
		case "os":
			bd.OS = append(bd.OS, item)
		case "language":
			bd.Languages = append(bd.Languages, item)
		}
	}
	return bd
}
