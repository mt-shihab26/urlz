.PHONY: migrate-snapshot migrate-up setup dev build

## Apply all pending migrations
migrate-up:
	go run main.go migrate up

## Pull a snapshot of the current collections into a new migration file
migrate-snapshot:
	go run main.go migrate collections

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

# Live Reload
dev:
	@if ! command -v air > /dev/null; then \
            read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
            if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
                go install github.com/air-verse/air@latest; \
            else \
                echo "You chose not to install air. Exiting..."; \
                exit 1; \
            fi; \
        fi
	@air & (cd web && bun run dev); wait

