package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		jsonData := `[{
			"id": "pbc_links0000001",
			"name": "links",
			"type": "base",
			"system": false,
			"createRule": "@request.auth.id != ''",
			"listRule": "@request.auth.id != '' && user = @request.auth.id",
			"viewRule": "@request.auth.id != '' && user = @request.auth.id",
			"updateRule": "@request.auth.id != '' && user = @request.auth.id",
			"deleteRule": "@request.auth.id != '' && user = @request.auth.id",
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_links_code` + "`" + ` ON ` + "`" + `links` + "`" + ` (` + "`" + `code` + "`" + `)"
			],
			"fields": [
				{
					"autogeneratePattern": "[a-z0-9]{15}",
					"hidden": false,
					"id": "text3208210256",
					"max": 15,
					"min": 15,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"cascadeDelete": false,
					"collectionId": "_pb_users_auth_",
					"hidden": false,
					"id": "relation9847563210",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "user",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text1111111111",
					"max": 50,
					"min": 1,
					"name": "code",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"exceptDomains": null,
					"hidden": false,
					"id": "url2222222222",
					"name": "url",
					"onlyDomains": null,
					"presentable": false,
					"required": true,
					"system": false,
					"type": "url"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text3333333333",
					"max": 255,
					"min": 0,
					"name": "title",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "number4444444444",
					"max": null,
					"min": 0,
					"name": "clicks",
					"onlyInt": true,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "select5555555555",
					"maxSelect": 1,
					"name": "status",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": ["active", "disabled", "expired"]
				},
				{
					"hidden": false,
					"id": "date6666666666",
					"max": "",
					"min": "",
					"name": "expires",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "date"
				},
				{
					"hidden": false,
					"id": "json7777777777",
					"maxSize": 0,
					"name": "series",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "autodate8888888888",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "autodate9999999999",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			]
		}]`

		return app.ImportCollectionsByMarshaledJSON([]byte(jsonData), false)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("links")
		if err != nil {
			return nil
		}
		return app.Delete(collection)
	})
}
