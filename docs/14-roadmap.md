# Roadmap & Phasing

## Phase 0 — Documentation (Completed)

- Architecture, folder structure, and engineering conventions defined
  (this document set).
- Architecture now reflects the `apps/web` and `apps/api` monorepo.

## Phase 1 — Foundations

- Scaffold Next.js + TypeScript + Tailwind + Shadcn UI project per
  `03-folder-structure.md`.
- Set up linting, formatting, `tsconfig`, CI pipeline skeleton.
- Laravel/Eloquent schema, catalog API, secure guest carts, inventory actions,
  abandoned-cart scheduling, customer authentication, customer account APIs,
  and transactional checkout are implemented.
- Set up base layout, theme, and design tokens.

## Phase 2 — Storefront Core

- Product catalog: Laravel-backed listing, filters, product detail page, live
  price, and live inventory.
- Cart: add/update/remove items, cart drawer.
- Visitors can build a guest cart; registration/login is required at checkout.
- Payment-provider initiation remains open until a gateway is selected.

## Phase 3 — Accounts (Completed)

- Custom Laravel mobile/password authentication with independent login and
  registration pages, logout, password recovery, and Kavenegar OTP support.
- Profile, address book, default checkout address, and user-owned order history.

## Phase 4 — Admin (Completed)

- Filament 5 products, variants, pricing, audited inventory, orders,
  controlled fulfillment transitions, payments/refunds (read-only until a
  gateway is selected), shipments/tracking, users, and abandoned carts.

## Phase 5 — Hardening

- Full E2E coverage of critical journeys.
- Performance pass (Core Web Vitals, image/bundle optimization).
- Accessibility audit.

## Future / Out of Scope for v1 (candidates)

- Multi-currency and localization.
- Multi-vendor marketplace support.
- Native mobile apps.
- Advanced feature flagging service.
- Subscription/recurring orders (e.g. recurring rice delivery).

## Decision Log (open items requiring a decision before/during Phase 1)

| Item | Status |
|---|---|
| Persistence layer | Laravel Eloquent selected; production database open |
| Auth provider (NextAuth vs. custom) | Custom Laravel auth selected |
| SMS provider | Kavenegar selected; production API key/templates required |
| Payment provider | Open |
| Hosting platform confirmation | Open |
| Logging/error-tracking provider | Open |
