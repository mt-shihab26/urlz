package util

import "github.com/pocketbase/pocketbase/core"

func abort(e *core.RequestEvent, status int, message string) error {
	return e.JSON(status, map[string]string{
		"error": message,
	})
}
