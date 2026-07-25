# Roadmap & Phasing

## Phase 0 — Documentation (Current)

- Architecture, folder structure, and engineering conventions defined
  (this document set).
- **Awaiting approval before any code, dependencies, or pages are created.**

## Phase 1 — Foundations

- Scaffold Next.js + TypeScript + Tailwind + Shadcn UI project per
  `03-folder-structure.md`.
- Set up linting, formatting, `tsconfig`, CI pipeline skeleton.
- Choose and integrate ORM/database (finalize the "TBD" items in
  `02-tech-stack.md` and `13-deployment.md`).
- Set up base layout, theme, and design tokens.

## Phase 2 — Storefront Core

- Product catalog: listing, filters, product detail page.
- Cart: add/update/remove items, cart drawer.
- Checkout flow (single currency, single payment provider).

## Phase 3 — Accounts

- Customer authentication (provider TBD).
- Order history and profile management.

## Phase 4 — Admin

- Inventory management.
- Order management/fulfillment status updates.

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
| ORM/database engine | Open |
| Auth provider (NextAuth vs. custom) | Open |
| Payment provider | Open |
| Hosting platform confirmation | Open |
| Logging/error-tracking provider | Open |
