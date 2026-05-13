package show

import (
	"fmt"

	"github.com/pocketbase/dbx"
)

type statsData struct {
	TotalClicks     int `db:"total_clicks"     json:"total_clicks"`
	PeriodClicks    int `db:"period_clicks"    json:"period_clicks"`
	UniqueCountries int `db:"unique_countries" json:"unique_countries"`
}

func fetchStats(db dbx.Builder, linkID, since string) statsData {
	params := dbx.Params{"id": linkID}
	sinceExpr := "1"
	if since != "" {
		sinceExpr = "date >= {:since}"
		params["since"] = since
	}
	var r statsData
	_ = db.NewQuery(fmt.Sprintf(`
		SELECT
			COUNT(*) as total_clicks,
			SUM(CASE WHEN %s THEN 1 ELSE 0 END) as period_clicks,
			COUNT(DISTINCT CASE WHEN country_code != '' THEN country_code END) as unique_countries
		FROM clicks WHERE link = {:id}
	`, sinceExpr)).Bind(params).One(&r)
	return r
}
