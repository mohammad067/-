# Tech Stack & Rationale

## 1. Next.js (App Router)

- Storefront framework for routing, server rendering, streaming, and BFF routes.
- React Server Components reduce client bundle size for a content-heavy
  storefront (product listings, PDPs).
- Built-in support for image optimization, metadata API (SEO), and
  incremental static regeneration for product pages.

## 2. TypeScript (strict mode)

- `strict: true` enforced repo-wide; no implicit `any`.
- Storefront types live in `apps/web/src/types` and mirror the versioned
  Laravel API contracts. Laravel remains authoritative.

## 3. Laravel 13 and PHP 8.4

- Owns the catalog, inventory, carts, orders, payments, and scheduled work.
- Eloquent provides database access and migrations.
- PHPUnit covers API and domain behavior; Pint enforces PHP formatting.
- Filament will provide the internal panel while reusing application actions.

## 4. Tailwind CSS

- Utility-first styling avoids hand-rolled CSS files and naming schemes.
- Design tokens (color palette, spacing, typography scale) are centralized in
  `tailwind.config.ts` — see `06-styling-guidelines.md`.

## 5. Shadcn UI

- Provides accessible, unstyled-by-default primitives (Radix UI under the
  hood) that are copied into the repo (`src/components/ui`) rather than
  imported as an opaque dependency.
- Fully themeable via Tailwind tokens; avoids fighting a third-party design
  system.

## 6. Framer Motion

- Used for intentional motion only: page/route transitions, list
  add/remove animations (e.g. cart items), micro-interactions on
  buttons/cards.
- Not used to implement core UI logic — motion is presentational.

## 7. TanStack Query

- Single source of truth for all server-derived data on the client.
- Provides caching, background refetching, request deduplication, optimistic
  updates (e.g. add-to-cart), and pagination/infinite-query support for
  product listings.

## 8. Zustand

- Minimal, boilerplate-free store for client-only UI state (cart drawer open
  state, filter panel state, checkout wizard step, admin table selection).
- Stores are colocated with the feature that owns them, not a single global
  store.

## 9. Supporting Libraries

| Library | Purpose |
|---|---|
| `zod` | Runtime schema validation, shared client/server |
| `react-hook-form` | Form state management, integrates with `zod` resolvers |
| `vitest` + `@testing-library/react` | Unit/integration testing |
| `playwright` | End-to-end testing |
| `eslint` + `prettier` | Linting and formatting |

Laravel/Eloquent is the selected persistence layer. SQLite is used locally and
in automated tests; production uses MariaDB/MySQL. PostgreSQL is not required.
