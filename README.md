<p align="center">
  <img src="web/public/logo.svg" width="96" height="96" alt="urlz logo"/>
</p>

# urlz

A self-hosted URL shortener with a **real-time analytics dashboard** — tracks geography, browser, device, OS, language, and referrer for every click.

---

## Features

### Link Management
- Create shortened links with auto-generated or custom codes
- Edit, enable/disable, and delete links
- Set link expiration dates
- Search and filter links (active / disabled / expiring)
- Per-link sparkline showing recent click trend

### Real-Time Dashboard
All dashboard data updates **live** without page refresh via PocketBase WebSocket subscriptions:
- **Overview** — total links, total clicks, top performers, click breakdown by country/device/browser
- **Links** — full link table with inline click counts, live status
- **Link detail** — per-link analytics, click volume chart, click history table
- **Clicks** — paginated full click history with real-time append
- **Analytics** — aggregated traffic by country, device, browser, OS, language, referrer

### Click Tracking
Every redirect captures:
- Country, city, region, timezone
- Browser, OS, device type
- Language, referrer, IP, user agent

### Auth & Settings
- Sign up / sign in / forgot password / reset password
- Google OAuth
- Profile management (name, email, avatar, password)
- Light / dark theme toggle
- Account deletion

---

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Go + [PocketBase](https://pocketbase.io) (embedded SQLite) |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, shadcn/ui |

---

## Getting Started

### Prerequisites
- Go 1.22+
- Bun 1.3+
- Node 25.6+

### Setup

```bash
make setup
```

Installs frontend dependencies and copies `.env.example` → `.env`.

### Development

```bash
make dev
```

Starts Go backend with hot reload (air) and Vite dev server concurrently.

- Backend: `http://localhost:8090`
- Frontend: `http://localhost:5173`
- PocketBase admin: `http://localhost:8090/_/`

### Seed Data

```bash
make seed LINKS=30 EMAIL=you@example.com PASSWORD=secret
```

Generates fake links and click history for local testing.

### Database Migrations

```bash
make migrate-up           # Apply pending migrations
make migrate-snapshot     # Create a new snapshot
make superuser            # Create a PocketBase superuser
```

---

## Project Structure

```
urlz/
├── main.go                  # Entry point, redirect handler
├── internal/                # Go handlers and business logic
├── migrations/              # PocketBase schema migrations
└── web/
    └── src/
        ├── pages/           # Route-level page components
        ├── components/
        │   ├── screens/     # Feature components per page
        │   ├── composite/   # Shared compound components
        │   └── ui/          # Base UI primitives (shadcn)
        ├── collections/     # PocketBase data layer + subscriptions
        ├── hooks/           # Custom React hooks
        └── lib/             # Utilities, formatters
```

---

## How Redirects Work

`GET /{code}` is handled by the Go backend. It resolves the short code, records a click (capturing geo, device, browser data), then issues a `302` redirect to the destination URL — all before the browser loads anything.
