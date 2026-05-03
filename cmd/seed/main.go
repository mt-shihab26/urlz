package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/pocketbase/pocketbase"

	"github.com/mt-shihab26/urlz/internal/seed"
	_ "github.com/mt-shihab26/urlz/migrations"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment")
	}
	app := pocketbase.NewWithConfig(pocketbase.Config{
		DefaultDev:     true,
		DefaultDataDir: ".data",
	})
	seed.Run(app)
}
