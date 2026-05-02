package seed

import (
	"github.com/brianvoe/gofakeit/v6"
	"github.com/pocketbase/pocketbase/core"
)

func ensureUser(app core.App, email, password string) (*core.Record, error) {
	if existing, err := app.FindAuthRecordByEmail("users", email); err == nil {
		return existing, nil
	}

	collection, err := app.FindCollectionByNameOrId("users")
	if err != nil {
		return nil, err
	}

	user := core.NewRecord(collection)
	user.Set("email", email)
	user.Set("name", gofakeit.Name())
	user.SetPassword(password)
	user.Set("emailVisibility", true)

	if err := app.Save(user); err != nil {
		return nil, err
	}
	return user, nil
}
