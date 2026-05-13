package index

import (
	"fmt"
	"strings"

	"github.com/pocketbase/dbx"
)

type clickDay struct {
	Date   string `json:"date"`
	Clicks int    `json:"clicks"`
}

func buildPlaceholders(ids []string) ([]string, dbx.Params) {
	params := dbx.Params{}
	placeholders := make([]string, len(ids))
	for i, id := range ids {
		key := fmt.Sprintf("id%d", i)
		placeholders[i] = "{:" + key + "}"
		params[key] = id
	}
	return placeholders, params
}

func fetchClickCounts(db dbx.Builder, ids []string) map[string]int {
	placeholders, params := buildPlaceholders(ids)
	type row struct {
		Link  string `db:"link"`
		Total int    `db:"total"`
	}
	var rows []row
	_ = db.NewQuery(fmt.Sprintf(
		"SELECT link, COUNT(*) as total FROM clicks WHERE link IN (%s) GROUP BY link",
		strings.Join(placeholders, ","),
	)).Bind(params).All(&rows)

	counts := make(map[string]int, len(rows))
	for _, r := range rows {
		counts[r.Link] = r.Total
	}
	return counts
}

func fetchSparklines(db dbx.Builder, ids []string) map[string][]clickDay {
	placeholders, params := buildPlaceholders(ids)
	type row struct {
		Link   string `db:"link"`
		Date   string `db:"date"`
		Clicks int    `db:"clicks"`
	}
	var rows []row
	_ = db.NewQuery(fmt.Sprintf(
		"SELECT link, date, COUNT(*) as clicks FROM clicks WHERE link IN (%s) AND date >= date('now', '-14 days') GROUP BY link, date ORDER BY link, date",
		strings.Join(placeholders, ","),
	)).Bind(params).All(&rows)

	sparkMap := make(map[string][]clickDay)
	for _, r := range rows {
		sparkMap[r.Link] = append(sparkMap[r.Link], clickDay{Date: r.Date, Clicks: r.Clicks})
	}
	return sparkMap
}
