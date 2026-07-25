# Folder Structure

## 1. Top-Level Layout

```
rice-shop/
├── docs/                     # This documentation set
├── public/                   # Static assets (images, favicon, fonts)
├── src/
│   ├── app/                  # Next.js App Router: routes, layouts, pages
│   ├── components/           # Shared, reusable UI components
│   ├── features/             # Feature-scoped code (UI + hooks + store)
│   ├── server/                # Domain services, repositories, API-only code
│   ├── lib/                  # Framework-agnostic utilities/helpers
│   ├── hooks/                 # Shared, cross-feature React hooks
│   ├── stores/                 # Cross-feature Zustand stores (rare; prefer feature-local)
│   ├── styles/                # Global CSS, Tailwind base layer
│   ├── types/                  # Shared TypeScript types & zod schemas
│   └── config/                 # Environment/config loading and validation
├── tests/                     # Cross-cutting/e2e tests (Playwright)
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 2. `src/app/` — Routing Layer

```
src/app/
├── (storefront)/             # Route group: public storefront
│   ├── layout.tsx
│   ├── page.tsx               # Home page
│   ├── products/
│   │   ├── page.tsx           # Product listing
│   │   └── [slug]/page.tsx    # Product detail page
│   ├── cart/page.tsx
│   └── checkout/page.tsx
├── (account)/                 # Route group: authenticated customer area
│   ├── layout.tsx
│   ├── orders/page.tsx
│   └── profile/page.tsx
├── (admin)/                   # Route group: internal admin area
│   ├── layout.tsx
│   ├── inventory/page.tsx
│   └── orders/page.tsx
├── api/                        # Route Handlers (BFF endpoints)
│   ├── products/route.ts
│   ├── cart/route.ts
│   ├── orders/route.ts
│   └── auth/[...nextauth]/route.ts (placeholder, auth provider TBD)
├── layout.tsx                  # Root layout
└── globals.css
```

Route groups (`(storefront)`, `(account)`, `(admin)`) separate layouts and
access rules without affecting the URL path.

## 3. `src/features/` — Feature Modules

Each feature owns its UI, hooks, and local store, promoting high cohesion:

```
src/features/
├── product-catalog/
│   ├── components/
│   ├── hooks/                  # useProducts, useProductFilters (TanStack Query)
│   ├── store.ts                # Zustand store for filter/sort UI state
│   └── types.ts
├── cart/
│   ├── components/
│   ├── hooks/                  # useCart (TanStack Query + mutations)
│   ├── store.ts                # Zustand store for cart drawer UI state
│   └── types.ts
├── checkout/
│   ├── components/
│   ├── hooks/
│   ├── store.ts                # Wizard step state
│   └── types.ts
└── admin-inventory/
    ├── components/
    ├── hooks/
    └── types.ts
```

## 4. `src/server/` — Backend-Only Code

```
src/server/
├── services/                    # Domain/business logic
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   └── inventory.service.ts
├── repositories/                 # Data access
│   ├── product.repository.ts
│   ├── order.repository.ts
│   └── inventory.repository.ts
├── auth/                          # Session/auth helpers
└── validation/                    # zod schemas for API payloads
```

`src/server` must never be imported from Client Components. ESLint boundary
rules will enforce this (see `11-coding-standards.md`).

## 5. `src/components/` — Shared UI

```
src/components/
├── ui/                # Shadcn UI primitives (button, dialog, input, etc.)
├── layout/            # Header, Footer, Nav, Sidebar
└── common/            # Cross-feature composites (ProductCard, PriceTag)
```

## 6. Naming Conventions

- Folders: `kebab-case`.
- Component files: `PascalCase.tsx`.
- Hooks: `useCamelCase.ts`.
- Zustand stores: `<feature>.store.ts` exporting `use<Feature>Store`.
- Services/repositories: `<domain>.service.ts` / `<domain>.repository.ts`.
