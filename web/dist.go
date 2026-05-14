package web

import "embed"

//go:embed all:dist/client
var DistFS embed.FS
