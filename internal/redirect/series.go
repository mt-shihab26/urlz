package redirect

import (
	"encoding/json"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

type serie struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

func updatedSeries(app core.App, record *core.Record) []serie {
	today := time.Now().UTC().Format("2006-01-02")
	var series []serie
	data, err := json.Marshal(record.Get("series"))
	if err != nil {
		app.Logger().Error("updatedSeries: marshal", "id", record.Id, "err", err)
		return append(series, serie{Date: today, Clicks: 1})
	}
	if err := json.Unmarshal(data, &series); err != nil {
		app.Logger().Error("updatedSeries: unmarshal", "id", record.Id, "err", err)
		return append(series, serie{Date: today, Clicks: 1})
	}
	for i, s := range series {
		if s.Date == today {
			series[i].Clicks++
			return series
		}
	}
	return append(series, serie{Date: today, Clicks: 1})
}
