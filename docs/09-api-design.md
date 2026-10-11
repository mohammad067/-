# API Design

## Ownership

The versioned JSON API lives in `apps/api` and Laravel owns validation,
authorization, pricing, stock, order, and payment decisions. Next.js BFF
handlers may forward requests and manage secure cookies, but must not duplicate
those rules.

Successful resources use Laravel's `{ "data": ... }` envelope. Domain errors
use a stable code and HTTP status. Monetary fields are integer rials and public
identifiers are ULIDs, except product lookup which uses its SEO slug.

## Implemented v1 endpoints

| Method | Path | Purpose | Access |
|---|---|---|---|
| GET | `/api/v1/products` | Filtered cursor-paginated catalog | Public |
| GET | `/api/v1/products/{slug}` | Published product detail | Public |
| POST | `/api/v1/carts` | Create guest cart and one-time token | Public |
| GET | `/api/v1/carts/{cartId}` | Read or recover a guest cart | Cart token |
| PUT | `/api/v1/carts/{cartId}/items/{variantId}` | Set item quantity | Cart token |
| DELETE | `/api/v1/carts/{cartId}/items/{variantId}` | Remove item | Cart token |
| POST | `/api/v1/auth/register` | Create a customer account | Public, throttled |
| POST | `/api/v1/auth/login` | Create an API session | Public, throttled |
| POST | `/api/v1/auth/password/request` | Send a password-reset OTP without account enumeration | Public, throttled |
| POST | `/api/v1/auth/password/confirm` | Consume OTP and replace password | Public, throttled |
| GET | `/api/v1/auth/me` | Read the current customer | Bearer token |
| POST | `/api/v1/auth/logout` | Revoke the current API session | Bearer token |
| GET/PATCH | `/api/v1/account/profile` | Read or update customer profile | Bearer token |
| GET/POST | `/api/v1/account/addresses` | List or create saved addresses | Bearer token |
| PATCH/DELETE | `/api/v1/account/addresses/{address}` | Update or delete an owned address | Bearer token |
| GET | `/api/v1/account/orders` | Paginated customer order history | Bearer token |
| POST | `/api/v1/account/phone-verification/request` | Send phone-verification OTP | Bearer token, throttled |
| POST | `/api/v1/account/phone-verification/confirm` | Consume phone-verification OTP | Bearer token, throttled |
| POST | `/api/v1/orders` | Place an idempotent customer order | Bearer + cart token + idempotency key |
| GET | `/api/v1/orders/{orderId}` | Read a customer-owned order | Bearer token |

The guest cart token is sent in `X-Cart-Token`. Next.js must keep it in a
secure HTTP-only cookie rather than local storage. An abandoned, unexpired cart
is restored when its valid token is presented.

Visitors may keep a guest cart, but order placement requires a registered and
authenticated customer. It requires `X-Idempotency-Key`, takes the cart ID plus
recipient/address data, recalculates all prices in Laravel, reserves inventory,
and links the order to `users.id` in the same transaction. The BFF stores the
plain API token only in an HTTP-only cookie; Laravel stores only its SHA-256
hash.

## Planned endpoints

Payment initiation/verification, webhooks, refunds, and expanded order tracking
will be added under the same `/api/v1` namespace after the payment provider and
authorization requirements are finalized.

Payment redirects are not proof of payment; Laravel accepts success only after
server-to-server gateway verification.
