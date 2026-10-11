# Architecture

## System boundary

Talaye Shalizar is a monorepo containing two deployable applications:

```text
Browser ──> Next.js storefront/BFF ──> Laravel API ──> Database
                                           │
                                           ├── Payment gateways
                                           ├── SMS provider
                                           └── Shipping providers

Administrators ──> Filament panel ─────────┘
```

Laravel is the only owner of commerce data and rules. Products, prices,
inventory, carts, orders, payment verification, refunds, and shipments must
not be implemented independently in Next.js or Filament.

## Application responsibilities

### `apps/web`

- Storefront UI and customer interaction.
- Server Components and client-side UI state.
- Secure BFF cookies and requests to Laravel.
- Display formatting, including toman/Jalali presentation where needed.
- No authoritative pricing, inventory, order, or payment decisions.

### `apps/api`

- Versioned public API.
- Catalog, cart, checkout, inventory, order, and payment rules.
- Authentication and authorization.
- Database transactions, scheduled maintenance, queues, and audit records.
- Filament administration using the same application actions as the API.

## Data flow

Next.js may cache public catalog responses, but all writes go to Laravel. The
Laravel response is authoritative. Browser redirects from a payment gateway
never prove payment success; Laravel verifies every result server-to-server.

The detailed backend state machines and invariants live in
`apps/api/docs/backend-architecture.md`.
