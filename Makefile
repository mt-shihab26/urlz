.PHONY: build dev migrate-snapshot migrate-up setup seed superuser

EMAIL    ?= dev@example.com
PASSWORD ?= password1234
SUPERUSER_EMAIL ?= mt.shihab26@gmail.com
SUPERUSER_PASS  ?= password1234
LINKS    ?= 30

# Seed the database with fake data for development
# Examples:
#   make seed
#   make seed LINKS=100
#   make seed EMAIL=me@test.com PASSWORD=secret LINKS=50
seed:
	go run ./cmd/seed --email $(EMAIL) --password $(PASSWORD) --links $(LINKS)

# Create a superuser account
superuser:
	go run ./cmd/server superuser create $(SUPERUSER_EMAIL) $(SUPERUSER_PASS)

# Apply all pending migrations
migrate-up:
	go run ./cmd/server migrate up

# Pull a snapshot of the current collections into a new migration file
migrate-snapshot:
	go run ./cmd/server migrate collections

# Setup the project (copy .env files, install dependencies)
setup:
	@echo "==> Setting up server..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "    Created .env from .env.example"; \
	fi
	@go mod download
	@echo "==> Setting up web..."
	@cd web && bun install
	@echo ""
	@echo "Setup complete. Edit .env and web/.env, then run: make dev"

# Live reload
dev:
	@if ! command -v air > /dev/null; then \
		read -p "Go's 'air' is not installed. Install it? [Y/n] " choice; \
		if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
			go install github.com/air-verse/air@latest; \
		else \
			echo "Skipping air install. Exiting..."; \
			exit 1; \
		fi; \
	fi
	@cd web && bun run build
	@air & (cd web && bun run dev); wait
