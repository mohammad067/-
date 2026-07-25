# Routing (Next.js App Router)

## 1. Route Groups

Three route groups isolate layout and access rules without affecting the
public URL:

- `(storefront)` — public: home, product listing, product detail, cart,
  checkout.
- `(account)` — requires authenticated customer session: orders, profile.
- `(admin)` — requires `admin` role: inventory management, order management.

## 2. URL Map (v1)

| Path | Route Group | Description |
|---|---|---|
| `/` | storefront | Home page |
| `/products` | storefront | Product listing with filters |
| `/products/[slug]` | storefront | Product detail page |
| `/cart` | storefront | Cart page |
| `/checkout` | storefront | Checkout flow |
| `/account/orders` | account | Order history |
| `/account/profile` | account | Profile management |
| `/admin/inventory` | admin | Inventory management |
| `/admin/orders` | admin | Order management |
| `/api/products` | — | Product API |
| `/api/cart` | — | Cart API |
| `/api/orders` | — | Orders API |

## 3. Layouts

- Root `layout.tsx`: fonts, global providers (TanStack Query provider, theme
  provider), global CSS.
- `(storefront)/layout.tsx`: Header/Footer/Nav shared by public pages.
- `(account)/layout.tsx`: adds auth guard + account-specific sidebar nav.
- `(admin)/layout.tsx`: adds admin auth guard + admin sidebar nav.

## 4. Access Control at the Route Level

- `(account)` and `(admin)` layouts perform a server-side session check
  (redirecting to `/login` or a 403 page) before rendering children — access
  control is enforced at the layout/server level, not just hidden in the UI.
- Middleware (`middleware.ts`) provides a first line of defense for route
  matching (e.g. redirect unauthenticated users hitting `/admin/*` before
  the layout even renders).

## 5. Data Loading per Route

- Listing/detail pages fetch initial data server-side in the page component
  and hydrate TanStack Query's cache with `initialData`/`HydrationBoundary`
  so the client doesn't refetch on load.
- Dynamic segments (`[slug]`) use `generateStaticParams` for known products
  where feasible, combined with ISR (`revalidate`) for freshness.

## 6. Error & Loading States

- Each route segment that fetches data defines `loading.tsx` (skeleton UI)
  and `error.tsx` (recoverable error boundary) following the App Router
  convention.
- A top-level `not-found.tsx` handles unmatched routes and invalid product
  slugs.

## 7. Metadata & SEO

- Each page exports `generateMetadata` for dynamic titles/descriptions
  (product name, price) rather than a single static `<Head>`.
- `sitemap.ts` and `robots.ts` are defined at the app root using the Next.js
  metadata file conventions.
