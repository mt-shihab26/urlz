package main

import (
	"github.com/mt-shihab26/urlz/internal/app"
	"github.com/mt-shihab26/urlz/internal/seed"
)

func main() {
	seed.Run(app.New())
}
