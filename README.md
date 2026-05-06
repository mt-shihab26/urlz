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

| Plan | Price | Highlights |
|---|---|---|
| Free | $0 | 5 short links, basic analytics, custom slugs |
| Pro | $9/mo | Unlimited links, full analytics, expiry dates, priority support |
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

| Layer | Tech |
|---|---|
| Backend | Go + [PocketBase](https://pocketbase.io) (embedded SQLite) |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, shadcn/ui |
| Billing | Stripe |

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

### Environment Variables

| Variable | Description |
|---|---|
| `APP_URL` | Public URL of the app (used for Stripe redirect URLs) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_PRODUCT_ID` | Stripe product ID for the Pro plan |
| `STRIPE_BUSINESS_PRODUCT_ID` | Stripe product ID for the Business plan |

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
├── cmd/
│   ├── server/              # Main server binary
│   └── seed/                # Seed CLI binary
├── internal/
│   ├── app/                 # PocketBase app factory
│   ├── billing/             # Stripe checkout, subscriptions, webhooks
│   ├── redirect/            # Short-code redirect handler + click tracking
│   └── seed/                # Seed logic (users, links, clicks)
├── migrations/              # PocketBase schema migrations
└── web/                     # React frontend (embedded into server binary)
    └── src/
        ├── pages/           # Route-level page components
        ├── components/
        │   ├── screens/     # Feature components per page
        │   ├── composite/   # Shared compound components
        │   └── ui/          # Base UI primitives (shadcn)
        ├── collections/     # PocketBase data layer
        ├── hooks/           # Custom React hooks
        └── lib/             # Utilities, formatters
```

---

## How Redirects Work

`GET /{code}` is handled by the Go backend. It resolves the short code, records a click (capturing geo, device, browser data), then issues a `302` redirect to the destination URL — all before the browser loads anything.
