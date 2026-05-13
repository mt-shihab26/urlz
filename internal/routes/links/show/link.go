package show

import (
	"errors"

	"github.com/pocketbase/dbx"
)

type linkData struct {
	ID      string `db:"id"      json:"id"`
	Code    string `db:"code"    json:"code"`
	URL     string `db:"url"     json:"url"`
	Title   string `db:"title"   json:"title"`
	Status  string `db:"status"  json:"status"`
	User    string `db:"user"    json:"user"`
	Created string `db:"created" json:"created"`
	Updated string `db:"updated" json:"updated"`
	Expires string `db:"expires" json:"expires"`
}

func fetchLink(db dbx.Builder, id, uid string) (linkData, error) {
	var row linkData
	err := db.NewQuery(`
		SELECT id, code, url, title, status, user, created, updated, expires
		FROM links WHERE id = {:id} AND user = {:u}
	`).Bind(dbx.Params{"id": id, "u": uid}).One(&row)
	if err != nil {
		return linkData{}, errors.New("not found")
	}
	return row, nil
}
