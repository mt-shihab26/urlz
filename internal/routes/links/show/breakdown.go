package show

import (
	"fmt"
	"strings"

	"github.com/pocketbase/dbx"
)

type breakdownEntry struct {
	Label string  `json:"label"`
	Pct   float64 `json:"pct"`
}

type breakdownData struct {
	Countries []breakdownEntry `json:"countries"`
	Devices   []breakdownEntry `json:"devices"`
	Referrers []breakdownEntry `json:"referrers"`
	Browsers  []breakdownEntry `json:"browsers"`
	OS        []breakdownEntry `json:"os"`
	Languages []breakdownEntry `json:"languages"`
}

var breakdownFields = [][3]string{
	{"country", "country_name", "country_code"},
	{"device", "device", "device"},
	{"referrer", "referrer", "referrer"},
	{"browser", "browser", "browser"},
	{"os", "os", "os"},
	{"language", "language", "language"},
}

func fetchBreakdown(db dbx.Builder, linkID, since string) breakdownData {
	params := dbx.Params{"id": linkID}
	sinceClause := ""
	if since != "" {
		sinceClause = " AND date >= {:since}"
		params["since"] = since
	}
	parts := make([]string, len(breakdownFields))
	for i, f := range breakdownFields {
		parts[i] = fmt.Sprintf(
			"SELECT * FROM (SELECT '%s' AS field, %s AS label, ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS pct FROM clicks WHERE link={:id} AND %s!=''" +sinceClause+" GROUP BY %s ORDER BY COUNT(*) DESC LIMIT 6)",
			f[0], f[1], f[2], f[2],
		)
	}
	type row struct {
		Field string  `db:"field"`
		Label string  `db:"label"`
		Pct   float64 `db:"pct"`
	}
	bd := breakdownData{
		Countries: []breakdownEntry{},
		Devices:   []breakdownEntry{},
		Referrers: []breakdownEntry{},
		Browsers:  []breakdownEntry{},
		OS:        []breakdownEntry{},
		Languages: []breakdownEntry{},
	}
	var rows []row
	if err := db.NewQuery(strings.Join(parts, " UNION ALL ")).Bind(params).All(&rows); err != nil {
		return bd
	}
	for _, r := range rows {
		e := breakdownEntry{Label: r.Label, Pct: r.Pct}
		switch r.Field {
		case "country":
			bd.Countries = append(bd.Countries, e)
		case "device":
			bd.Devices = append(bd.Devices, e)
		case "referrer":
			bd.Referrers = append(bd.Referrers, e)
		case "browser":
			bd.Browsers = append(bd.Browsers, e)
		case "os":
			bd.OS = append(bd.OS, e)
		case "language":
			bd.Languages = append(bd.Languages, e)
		}
	}
	return bd
}
