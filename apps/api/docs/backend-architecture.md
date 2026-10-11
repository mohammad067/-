# Talaye Shalizar Backend Architecture

## 1. System boundary

Laravel is the only owner of commerce data and business rules. Next.js is the
customer-facing client, and Filament is an internal administration interface.
Both the public API and Filament must call the same application actions. No
pricing, stock, order, or payment rule may live only in a controller, API
resource, React component, or Filament resource.

```text
Next.js storefront ── API v1 ──┐
                              ├── Application actions ── Eloquent ── Database
Filament admin ────────────────┘          │
                                         └── Payment / SMS / Shipping contracts
```

## 2. Non-negotiable invariants

1. Monetary values are integer Iranian rials. Floating-point values are never
   used for storage or calculation.
2. Product prices, names, SKU values, shipping details, and addresses are
   snapshotted onto the order. Historical orders never depend on mutable
   catalog or address rows.
3. The server recalculates every cart and order total. Client totals are display
   hints and are never trusted.
4. Adding an item to a cart does not reserve stock. Stock is reserved atomically
   when an order is placed and released when the order expires or is cancelled.
5. Inventory changes are represented by append-only movements. Cached stock
   counters are changed only inside the same database transaction.
6. Payment creation, verification, and webhook processing are idempotent.
   Duplicate callbacks must return the already-known result without changing
   stock, order totals, or status a second time.
7. Payment success is accepted only after server-to-server verification with
   the configured gateway. Browser redirects are not proof of payment.
8. Order and payment status transitions are explicit and validated. Arbitrary
   status assignment from API or Filament is forbidden.
9. Public identifiers use ULIDs. Internal numeric keys are never an
   authorization mechanism.
10. Dates are stored in UTC. Persian/Jalali formatting belongs to presentation
    layers only.

## 3. Domain modules

### Catalog

- `categories`: hierarchical storefront grouping.
- `products`: descriptive rice identity, origin, variety, and harvest year.
- `product_variants`: sellable SKU, package weight, price, and sale status.
- `product_images`: ordered product/variant media.

`Product` is descriptive. Price, stock, and SKU always belong to a
`ProductVariant`, even if a product initially has only one package size.

### Inventory

- `inventory_items`: one counter row per product variant (`on_hand` and
  `reserved`). Available stock is derived as `on_hand - reserved`.
- `inventory_reservations`: temporary order reservations with expiry and
  lifecycle status.
- `inventory_movements`: immutable audit ledger for receipts, reservations,
  sales, releases, returns, and manual corrections.

All reservation and commitment operations lock the inventory row with
`lockForUpdate()` inside a database transaction. An idempotency key prevents a
retry from applying the same movement twice.

### Identity and addresses

- `users`: customer, staff, and administrator identities. Customer login may be
  phone/OTP; panel login uses a password and session.
- `addresses`: mutable customer address book.
- `otp_challenges`: hashed, expiring, single-use challenges. Plain OTP codes are
  never stored.

OTP request and verification endpoints require rate limits based on both the
normalized phone number and request IP.

### Cart

- `carts`: authenticated or guest shopping session.
- `cart_items`: variant and requested quantity, unique per cart/variant.

A guest cart is protected by a high-entropy secret whose hash is stored. It can
be claimed or merged after authentication. Price and availability are resolved
again whenever the cart is read and when checkout begins.

An active cart containing items is marked `Abandoned` after the configured
inactivity window. Empty, expired, converted, and already ordered carts are not
eligible. The check is idempotent and runs every 15 minutes without overlap. A
valid cart token restores an unexpired abandoned cart to `Active` and records
its recovery time. Reminder timestamps are tracked, but no marketing message is
sent until a notification provider and consent policy are configured.

### Orders

- `orders`: totals, currency, lifecycle timestamps, and immutable commercial
  summary.
- `order_items`: product/SKU/price snapshots.
- `order_addresses`: shipping/billing snapshots.
- `order_status_histories`: append-only status audit trail.
- `shipments`: carrier, tracking code, and fulfillment lifecycle.

Order totals satisfy this equation:

```text
total_rials = subtotal_rials - discount_rials + shipping_rials + tax_rials
```

An order number is a public human-readable reference; the ULID is the stable API
identifier.

### Payments

- `payments`: each gateway attempt and its verified result.
- `payment_webhook_events`: deduplicated inbound callbacks and processing audit.
- `refunds`: refund attempts and verified outcomes.

Gateway-specific code implements `PaymentGateway`. Application actions depend
only on that contract. Gateway request/response metadata must exclude secrets
and raw card data.

## 4. State machines

### Order

```text
PendingPayment ── payment verified ──> Paid ──> Processing ──> Shipped ──> Delivered
       │                                  │           │
       ├── timeout ──> Expired            └───────────┴──> Cancelled
       └── cancel ──> Cancelled

Paid / Processing / Shipped / Delivered ── approved refund ──> Refunded
```

### Payment

```text
Pending ── gateway request ──> AwaitingVerification
   │                                  │
   ├── request failure ──> Failed     ├── verified ──> Paid
   └── cancelled ────────> Cancelled  └── rejected ──> Failed

Paid ── refund requested ──> PartiallyRefunded | Refunded
```

### Inventory reservation

```text
Active ── verified payment ──> Committed
   ├── order cancelled ──────> Released
   └── timeout ──────────────> Expired
```

## 5. Application layout

```text
app/
├── Actions/
│   ├── Cart/
│   ├── Inventory/
│   ├── Orders/
│   └── Payments/
├── Contracts/Payments/
├── Data/
├── Enums/
├── Exceptions/Domain/
├── Http/
│   ├── Controllers/Api/V1/
│   ├── Requests/Api/V1/
│   └── Resources/Api/V1/
├── Jobs/
├── Models/
├── Policies/
└── Providers/
```

- Controllers parse HTTP concerns and call one application action.
- Form Requests own validation and request-level authorization.
- API Resources own response serialization.
- Actions own one business operation and its transaction boundary.
- Models own relationships, casts, and small state predicates, not workflows.
- Jobs perform durable external work that needs retries.
- Filament Resources call Actions for every business mutation.

## 6. API v1 surface

```text
GET    /api/v1/products
GET    /api/v1/products/{product:slug}
POST   /api/v1/carts
GET    /api/v1/carts/{cart:public_id}
PUT    /api/v1/carts/{cart:public_id}/items/{variant:public_id}
DELETE /api/v1/carts/{cart:public_id}/items/{variant:public_id}
POST   /api/v1/auth/otp/request
POST   /api/v1/auth/otp/verify
GET    /api/v1/addresses
POST   /api/v1/addresses
POST   /api/v1/orders
GET    /api/v1/orders/{order:public_id}
POST   /api/v1/orders/{order:public_id}/payments
GET    /api/v1/payments/{payment:public_id}/callback
POST   /api/v1/webhooks/payments/{gateway}
GET    /api/v1/orders/track
```

Every list endpoint uses stable ordering and bounded pagination. Every write
endpoint validates unknown or sensitive fields instead of mass-assigning raw
request data.

## 7. Payment safety sequence

1. Create an order and reserve inventory in one database transaction.
2. Create a local `Pending` payment with a unique idempotency key.
3. Request a payment authority from the gateway outside the database
   transaction with explicit timeout and bounded retry rules.
4. Store the authority and redirect URL.
5. On callback/webhook, acquire a payment-scoped atomic lock.
6. Load and lock the payment and order rows.
7. If already finalized, return the stored result.
8. Verify server-to-server with the gateway and compare amount, currency, and
   authority with local values.
9. In one transaction, mark payment paid, mark order paid, commit inventory,
   and append status history.
10. Dispatch notifications only after the transaction commits.

## 8. Testing gates

- Feature tests cover each API success path, validation failure,
  authentication boundary, authorization boundary, and not-found scope.
- Unit tests cover total calculations and legal state transitions.
- Concurrency-oriented tests cover stock reservation and duplicate payment
  verification.
- Gateway implementations use Laravel HTTP fakes in tests; the suite never
  contacts a real payment or SMS provider.
- Factories provide meaningful states such as `active`, `outOfStock`, `paid`,
  and `expired`.

## 9. Delivery order

1. Schema, enums, model relationships, and factories.
2. Read-only catalog API.
3. Guest/authenticated cart API.
4. OTP authentication and customer addresses.
5. Order placement and inventory reservation.
6. Payment contract plus a fake gateway, then the selected production gateway.
7. Payment webhooks, expiry jobs, refunds, and shipment tracking.
8. Filament resources, policies, audit log, and operational dashboards.
