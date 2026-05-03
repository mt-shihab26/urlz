# Stripe Setup Guide

## 1. Create a Stripe account

Go to [stripe.com](https://stripe.com) and create an account (or use an existing one).

---

## 2. Create products and prices

In the Stripe Dashboard → **Product catalog** → **Add product**:

### Pro plan

| Field       | Value              |
|-------------|--------------------|
| Name        | Pro                |
| Price       | $9.00              |
| Billing     | Recurring / Monthly |
| Currency    | USD                |

After saving, copy the **Price ID** (starts with `price_...`).

### Business plan

| Field       | Value              |
|-------------|--------------------|
| Name        | Business           |
| Price       | $29.00             |
| Billing     | Recurring / Monthly |
| Currency    | USD                |

After saving, copy the **Price ID** (starts with `price_...`).

---

## 3. Get your API keys

Stripe Dashboard → **Developers** → **API keys**:

- **Publishable key** — starts with `pk_test_` (test) or `pk_live_` (production). Not needed server-side.
- **Secret key** — starts with `sk_test_` or `sk_live_`. Keep this secret.

---

## 4. Set up the webhook

Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**:

| Field            | Value                                      |
|------------------|--------------------------------------------|
| Endpoint URL     | `https://yourdomain.com/api/webhooks/stripe` |
| Events to listen | `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` |

After saving, click **Reveal** under **Signing secret** to get your `whsec_...` key.

For **local development**, use the Stripe CLI:

```bash
# Install Stripe CLI (https://stripe.com/docs/stripe-cli)
stripe login
stripe listen --forward-to localhost:8090/api/webhooks/stripe
```

The CLI prints a webhook signing secret to use locally.

---

## 5. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...        # Price ID from Pro product
STRIPE_BUSINESS_PRICE_ID=price_...  # Price ID from Business product
APP_URL=http://localhost:5173        # Change to your production URL
```

---

## 6. Configure the Stripe Customer Portal

Stripe Dashboard → **Settings** → **Billing** → **Customer portal**:

- Enable **Cancel subscriptions**
- Enable **Update subscriptions** (so users can switch plans)
- Set your **Return URL** to `https://yourdomain.com/dashboard/billing`

Save the configuration. Users clicking **Manage Subscription** will be redirected here.

---

## 7. Test the flow

Use Stripe test card numbers:

| Card number         | Behavior        |
|---------------------|-----------------|
| `4242 4242 4242 4242` | Success         |
| `4000 0000 0000 9995` | Card declined   |
| `4000 0025 0000 3155` | 3D Secure auth  |

Use any future expiry date and any 3-digit CVC.

---

## Plan limits

| Plan     | Links | Analytics |
|----------|-------|-----------|
| Free     | 5     | Basic     |
| Pro      | ∞     | Full      |
| Business | ∞     | Full      |

Limits are enforced server-side in `internal/hooks/links.go`.
