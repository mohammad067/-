# Tech Stack & Rationale

## 1. Next.js (App Router)

- Unified framework for routing, server rendering, streaming, and API routes.
- React Server Components reduce client bundle size for a content-heavy
  storefront (product listings, PDPs).
- Built-in support for image optimization, metadata API (SEO), and
  incremental static regeneration for product pages.

## 2. TypeScript (strict mode)

- `strict: true` enforced repo-wide; no implicit `any`.
- Shared types between client and server (e.g. `Product`, `Order`, `Cart`)
  live in `src/types` and are treated as the source of truth for API
  contracts, validated at runtime with `zod`.

## 3. Tailwind CSS

- Utility-first styling avoids hand-rolled CSS files and naming schemes.
- Design tokens (color palette, spacing, typography scale) are centralized in
  `tailwind.config.ts` — see `06-styling-guidelines.md`.

## 4. Shadcn UI

- Provides accessible, unstyled-by-default primitives (Radix UI under the
  hood) that are copied into the repo (`src/components/ui`) rather than
  imported as an opaque dependency.
- Fully themeable via Tailwind tokens; avoids fighting a third-party design
  system.

## 5. Framer Motion

- Used for intentional motion only: page/route transitions, list
  add/remove animations (e.g. cart items), micro-interactions on
  buttons/cards.
- Not used to implement core UI logic — motion is presentational.

## 6. TanStack Query

- Single source of truth for all server-derived data on the client.
- Provides caching, background refetching, request deduplication, optimistic
  updates (e.g. add-to-cart), and pagination/infinite-query support for
  product listings.

## 7. Zustand

- Minimal, boilerplate-free store for client-only UI state (cart drawer open
  state, filter panel state, checkout wizard step, admin table selection).
- Stores are colocated with the feature that owns them, not a single global
  store.

## 8. Supporting Libraries (proposed, pending approval)

| Library | Purpose |
|---|---|
| `zod` | Runtime schema validation, shared client/server |
| `react-hook-form` | Form state management, integrates with `zod` resolvers |
| An ORM (e.g. Prisma) | Type-safe database access — to be finalized in a future ADR once the database engine is chosen |
| `vitest` + `@testing-library/react` | Unit/integration testing |
| `playwright` | End-to-end testing |
| `eslint` + `prettier` | Linting and formatting |

These are documented here as anticipated dependencies; none are installed
yet, per the current project phase.
