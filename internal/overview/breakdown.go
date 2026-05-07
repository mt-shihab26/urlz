package overview

import (
	"fmt"
	"strings"

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

var breakdownFields = [][2]string{
	{"country", "country_name"},
	{"device", "device"},
	{"referrer", "referrer"},
	{"browser", "browser"},
	{"os", "os"},
	{"language", "language"},
}

func fetchBreakdown(db dbx.Builder, uid string) breakdownData {
	parts := make([]string, len(breakdownFields))
	for i, f := range breakdownFields {
		parts[i] = fmt.Sprintf(
			"SELECT * FROM (SELECT '%s' AS field, %s AS label, COUNT(*) AS count FROM clicks WHERE user={:u} AND %s!='' GROUP BY %s ORDER BY count DESC LIMIT 5)",
			f[0], f[1], f[1], f[1],
		)
	}
	type row struct {
		Field string `db:"field"`
		Label string `db:"label"`
		Count int    `db:"count"`
	}
	var rows []row
	db.NewQuery(strings.Join(parts, " UNION ALL ")).
		Bind(dbx.Params{"u": uid}).All(&rows)
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
