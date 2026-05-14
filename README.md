<img src="web/src/assets/logo.svg" width="96" height="96" alt="urlz logo"/>

# urlz

A self-hosted URL shortener with an analytics dashboard — tracks geography, browser, device, OS, language, and referrer for every click.

---

## Features

### Dashboard

- **Overview** — total links, total clicks, top performers, click breakdown by country/device/browser
- **Analytics** — aggregated traffic by country, device, browser, OS, language, referrer
- **Links** — full link table with inline click counts and status
- **Link detail** — per-link analytics, click volume chart, click history table
- **Clicks** — paginated full click history

### Link Management

- Create shortened links with auto-generated or custom codes
- Edit, enable/disable, and delete links
- Set link expiration dates
- Search and filter links (active / disabled / expiring)
- Per-link sparkline showing recent click trend

### Click Tracking

Every redirect captures:

- Country, city, region, timezone
- Browser, OS, device type
- Language, referrer, IP, user agent

### Billing & Subscriptions

Stripe-powered subscription billing with three tiers:

| Plan     | Price  | Highlights                                                                 |
| -------- | ------ | -------------------------------------------------------------------------- |
| Free     | $0     | 5 short links, basic analytics, custom slugs                               |
| Pro      | $9/mo  | Unlimited links, full analytics, expiry dates, priority support            |
| Business | $29/mo | Everything in Pro + team members, API access, custom domains (coming soon) |

- Stripe Checkout for plan upgrades
- Subscription management (cancel, resume)
- Invoice history

### Auth & Settings

- Sign up / sign in / forgot password / reset password
- Google OAuth
- Profile management (name, email, avatar, password)
- Light / dark theme toggle
- Account deletion

---

## Tech Stack

| Layer    | Tech                                                    |
| -------- | ------------------------------------------------------- |
| Backend  | Go + [PocketBase](https://pocketbase.io)                |
| Database | SQLite (dev) / [Turso](https://turso.tech) (production) |
| Frontend | TypeScript, React + TanStack Start (SPA)                |
| Routing  | TanStack Router (file-based)                            |
| Data     | TanStack Query, TanStack Table                          |
| Styling  | Tailwind CSS 4, shadcn/ui                               |
| Charts   | Recharts                                                |
| Billing  | Stripe                                                  |

---

## Getting Started

### Prerequisites

- Go 1.26+
- Bun 1.3+

### Setup

```bash
make setup
```

Installs frontend dependencies and copies `.env.example` → `.env`.

### Environment Variables

| Variable                     | Description                                           |
| ---------------------------- | ----------------------------------------------------- |
| `APP_URL`                    | Public URL of the app (used for Stripe redirect URLs) |
| `TURSO_DATABASE_URL`         | Turso database URL (production)                       |
| `TURSO_AUTH_TOKEN`           | Turso auth token (production)                         |
| `STRIPE_SECRET_KEY`          | Stripe secret key                                     |
| `STRIPE_PRO_PRODUCT_ID`      | Stripe product ID for the Pro plan                    |
| `STRIPE_BUSINESS_PRODUCT_ID` | Stripe product ID for the Business plan               |

### Development

```bash
make dev
```

Builds the frontend once, then starts Go backend with hot reload (air) and Vite dev server concurrently.

- Backend: `http://localhost:8090`
- Frontend: `http://localhost:5173`
- PocketBase admin: `http://localhost:8090/_/`

### Build

```bash
make build
```

Builds the frontend and compiles the Go binary (`urlz`) with the frontend embedded.

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
├── cmd/
│   ├── server/              # Main server binary
│   └── seed/                # Seed CLI binary
├── internal/
│   ├── app/                 # PocketBase app factory
│   ├── hooks/               # PocketBase record hooks (links, users)
│   ├── redirect/            # Short-code redirect handler + click tracking
│   ├── routes/              # Custom API route handlers (analytics, billing, clicks, links, overview)
│   └── seed/                # Seed logic (users, links, clicks)
├── migrations/              # PocketBase schema migrations
├── docs/                    # Additional documentation (e.g. Stripe setup)
└── web/                     # React frontend (embedded into server binary)
    └── src/
        ├── routes/          # File-based routes (TanStack Router)
        │   └── dashboard/
        │       ├── _auth/   # Authenticated layout + protected pages
        │       └── _guest/  # Unauthenticated pages (sign-in, sign-up, etc.)
        ├── components/
        │   ├── screens/     # Feature components per page
        │   ├── composite/   # Shared compound components
        │   ├── providers/   # React context providers (auth, theme)
        │   ├── icons/       # Custom icon components
        │   └── ui/          # Base UI primitives (shadcn)
        ├── collections/     # PocketBase data layer (users, links, billing)
        ├── services/        # TanStack Query service hooks
        ├── hooks/           # Custom React hooks
        ├── types/           # TypeScript model and utility types
        └── lib/             # Utilities, formatters
```

---

## How Redirects Work

`GET /{code}` is handled by the Go backend. It resolves the short code, records a click (capturing geo, device, browser data), then issues a `302` redirect to the destination URL — all before the browser loads anything.
