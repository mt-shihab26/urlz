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

func updatedSeries(record *core.Record) []serie {
	today := time.Now().UTC().Format("2006-01-02")
	var series []serie
	if data, err := json.Marshal(record.Get("series")); err == nil {
		_ = json.Unmarshal(data, &series)
	}
	for i, s := range series {
		if s.Date == today {
			series[i].Clicks++
			return series
		}
	}
	return append(series, serie{Date: today, Clicks: 1})
}
