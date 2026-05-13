package show

import (
	"fmt"

	"github.com/pocketbase/dbx"
)

type statsData struct {
	TotalClicks     int `json:"total_clicks"`
	PeriodClicks    int `json:"period_clicks"`
	UniqueCountries int `json:"unique_countries"`
}

func fetchStats(db dbx.Builder, linkID, since string) statsData {
	type row struct {
		TotalClicks     int `db:"total_clicks"`
		PeriodClicks    int `db:"period_clicks"`
		UniqueCountries int `db:"unique_countries"`
	}
	params := dbx.Params{"id": linkID}
	sinceExpr := "1"
	if since != "" {
		sinceExpr = "date >= {:since}"
		params["since"] = since
	}
	var r row
	_ = db.NewQuery(fmt.Sprintf(`
		SELECT
			COUNT(*) as total_clicks,
			SUM(CASE WHEN %s THEN 1 ELSE 0 END) as period_clicks,
			COUNT(DISTINCT CASE WHEN country_code != '' THEN country_code END) as unique_countries
		FROM clicks WHERE link = {:id}
	`, sinceExpr)).Bind(params).One(&r)
	return statsData{
		TotalClicks:     r.TotalClicks,
		PeriodClicks:    r.PeriodClicks,
		UniqueCountries: r.UniqueCountries,
	}
}
