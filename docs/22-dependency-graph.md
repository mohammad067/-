# System Dependency Graph

This document provides a comprehensive mapping of dependencies between Pages, Features, Components, Hooks, Services, Utilities, Contexts, and Global State inside the Premium Rice Shop workspace.

## 1. Architectural Layers & Relationships

```
┌────────────────────────────────────────────────────────┐
│                      Routing Layer                      │
│            (app/(storefront), app/(account))           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                     Feature Modules                     │
│          (features/product-catalog, features/cart)     │
└───────────┬───────────────┬────────────────┬───────────┘
            │               │                │
            ▼               ▼                ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Shared UI    │   │  Shared Hooks │   │Server Services│
│(components/ui)│   │  (hooks/)     │   │ (server/)     │
└───────────────┘   └───────────────┘   └───────────────┘
```

## 2. Granular Dependency Mapping

### 2.1 Pages
- **`/` (Homepage)**:
  - Imports: `src/components/layout/MainLayout`, `src/features/product-catalog/components/QuickViewModal`, `src/features/product-catalog/data/products`.
- **`/products` (Catalog)**:
  - Imports: `src/features/product-catalog/components/ProductGrid`, `src/features/product-catalog/components/ProductFilters`.
- **`/products/[slug]` (Details)**:
  - Imports: `src/features/product-catalog/hooks/useProductBySlug`.

### 2.2 Features
- **`product-catalog`**:
  - `ProductCard.tsx` imports: `src/components/ui/Card`, `src/components/ui/Button`, `src/components/ui/Badge`.
  - `QuickViewModal.tsx` imports: `src/components/ui/Glass`, `src/components/ui/Typography`, `src/components/ui/Button`.
  - Local store (`store.ts`) depends on **Zustand** for transient search/filtering UI state.

### 2.3 Shared Primitives
- **`src/components/ui/Glass.tsx`**: High-end glassmorphism styling parameters. Used across almost all visual features.
- **`src/components/layout/Navbar.tsx`**: Dynamic, floating navigation bar. Interacts with the active page scroll trigger.

### 2.4 State Management & Data Fetching
- **Server State**: Managed via **TanStack Query** inside `src/features/*/hooks/` to cache catalog resources.
- **Client/UI State**: Managed via **Zustand** stores (`src/features/cart/store.ts` for shopping cart drawers).
