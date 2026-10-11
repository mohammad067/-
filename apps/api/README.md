# Talaye Shalizar API

Laravel 13 backend for the Talaye Shalizar storefront. Laravel owns catalog,
pricing, carts, inventory, orders, payments, refunds, and fulfillment rules.
Next.js consumes the versioned JSON API; the Filament 5 panel reuses the same
audited domain actions for administration.

The detailed decisions, state machines, and delivery order are documented in
[`docs/backend-architecture.md`](docs/backend-architecture.md).

## Local setup

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan admin:create
php artisan serve
php artisan schedule:work
```

The API runs at `http://localhost:8000`. The Next.js development origin is
allowed through `CORS_ALLOWED_ORIGINS`.

The admin panel is available at `http://localhost:8000/admin`. PHP's `intl`
extension must be enabled before Composer installs Filament. The interactive
`admin:create` command asks for the first administrator's credentials without
putting the password in shell history.

## Implemented foundation

- Catalog, inventory, customer address, cart, order, payment, refund, and
  shipment schema.
- Explicit backed enums and model relationships/casts.
- Public ULIDs while internal foreign keys remain numeric.
- Read-only catalog API with filtering and cursor pagination.
- Customer authentication, profile, saved addresses, order history, password
  recovery, and Kavenegar-compatible phone verification.
- Guest-cart API protected by a one-time plain token whose SHA-256 hash is the
  only form stored in the database.
- Scheduled abandoned-cart detection for inactive non-empty carts, with secure
  recovery through the original cart token.
- Transactional and idempotent inventory reserve, commit, and release actions.
- Payment gateway contract and typed request/result objects, independent of a
  specific Iranian gateway.
- Integer rial amounts and immutable order snapshots.
- Password-based customer registration/login with hashed, expiring API tokens.
- Transactional, idempotent authenticated checkout with user-owned orders and
  server-owned totals.
- Filament resources for products, variants, audited inventory correction,
  orders and controlled status transitions, payments, refunds, shipments,
  users, and abandoned carts.

## API v1 currently available

```text
GET    /api/v1/products
GET    /api/v1/products/{slug}
POST   /api/v1/carts
GET    /api/v1/carts/{cartId}
PUT    /api/v1/carts/{cartId}/items/{variantId}
DELETE /api/v1/carts/{cartId}/items/{variantId}
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me
POST   /api/v1/auth/logout
POST   /api/v1/orders
GET    /api/v1/orders/{orderId}
```

`POST /carts` returns `meta.cartToken` once. Send it as `X-Cart-Token` for all
later guest-cart calls. In the Next.js app this token should live in a secure,
HTTP-only cookie managed by the BFF layer, never in local storage.

Active carts containing items become abandoned after
`CART_ABANDON_AFTER_HOURS`. The scheduler checks every 15 minutes. A valid cart
token automatically restores an abandoned, unexpired cart without losing its
items. Notification delivery is intentionally deferred until an SMS/email
provider and consent policy are selected.

`POST /orders` accepts recipient and shipping data only after authentication.
It requires the bearer token, `X-Cart-Token`, and `X-Idempotency-Key`. The order
is always linked to the authenticated customer. Password and plain API tokens
are never stored directly.

## Quality checks

```bash
vendor/bin/pint --dirty
php artisan test --compact
composer validate --no-check-publish
```

Production payment initiation is intentionally not enabled until a gateway is
selected and its credentials, callback signature rules, timeouts, and sandbox
behavior are known.
