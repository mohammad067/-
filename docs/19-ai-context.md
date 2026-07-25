# AI Context & Playbook

This document serves as the high-context, single source of truth for Artificial Intelligence assistants (AI) working inside this repository. It provides instant orientation regarding tech stack, system state, rules, and upcoming development milestones.

---

## 1. Project Identity & Status
- **Project Name**: Rice Shop — Premium Iranian Rice Store (طلای شالیزار)
- **Current Phase**: Phase 6 (Home Storefront Experience) Completed
- **Current Status**: Built the complete immersive, premium Persian storefront landing page at `/` with floating luxury Hero, Featured Rice Grid (8 varieties with full hover effects and interactive Quick View modals), Why Choose Us showcase, Category grid, Editorial narrative, Customer testimonials, Newsletter subscription, Instagram social integration, and final conversion CTA. Relocated the design-system sandbox to `/design-system` for modularity. Fully verified with perfect static production builds and zero linting warnings.
- **Next Phase**: Phase 7 (Shopping Cart & Order Orchestrations)

---

## 2. Tech Stack Definition
- **Framework**: Next.js 15 (App Router with Server Components as default)
- **Runtime**: React 19
- **Languages**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS v4 (Using CSS variables inside `globals.css`)
- **Animations**: Framer Motion (Optimized for smooth, luxury visual micro-interactions)
- **State Management**: Zustand (Minimal Client-side local/UI state)
- **Data Fetching**: TanStack Query & Axios (Server state cache management)
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React
- **Design Baseline**: Custom luxury glassmorphism primitives utilizing Shadcn UI principles.

---

## 3. High-Level Architecture
The project is built on **Feature-Based Architecture**:
- `src/app/`: Handles physical URL paths, layout nesting, and Server/Client Page boundaries.
- `src/features/`: Contains functional modules (e.g., `cart`, `product-catalog`). Each feature houses its localized `components/`, `hooks/`, `store.ts`, and types.
- `src/shared/`: Shareable, cross-feature blocks (`components/`, `services/`, `hooks/`, `lib/`, `types/`, `styles/`, `config/`).
- `src/server/`: Dedicated backend service layer, data access repositories, validation schemas, and database connectors. Fully decoupled from client code.

---

## 4. Current Task & Work Plan

### Completed Work
- [x] Defined core architectural guidelines and system-level rules.
- [x] Documented SEO, Authentication, Error Handling, Performance, and Dependency Graph files in English.
- [x] Initialized Next.js 15, React 19, and Tailwind CSS v4 environment (Phase 2).
- [x] Configured `tsconfig.json` absolute imports (`@/*`), ESLint, and Prettier rules.
- [x] Scaffolded precise directory structures matching `docs/03-folder-structure.md`, including detailed `README.md` files in every single folder.
- [x] Configured luxury theme variables (Primary `#2F5D50`, Accent `#C8A75D`, Background `#F8F6F2`, etc.) in `globals.css` with dark mode support.
- [x] Implemented reusable premium visual components: Typography, Button, Card, Input, Badge, Glass overlay, LoadingState, EmptyState, ErrorState (Phase 3).
- [x] Created premium, floating glass Navbar with multi-language layout selectors (Phase 4).
- [x] Built high-end RTL storefront layout (`src/app/layout.tsx`).
- [x] Designed a dramatic cinematic fullscreen Hero Section highlighting organic premium Iranian rice (Phase 4).
- [x] Presented dynamic component demonstrations and simulated state togglers (Loading, Empty, Error) within the landing page (Phase 4).
- [x] Created layout primitives: `Container.tsx`, `Section.tsx`, `MaxWidth.tsx`, `PageWrapper.tsx`, and `MainLayout.tsx`.
- [x] Structured App Router layout segments: `loading.tsx` (Loading Layout), `error.tsx` (Error Layout), and `not-found.tsx` (Not Found Layout).
- [x] Added fully operational E2E coverage for storefront pages, floating Navbar navigation, and state visualizers via Playwright tests (`tests/storefront.spec.ts`) (Phase 5).
- [x] Designed mock product database mapping 8 premium Iranian rice products (Phase 5 - Catalog).
- [x] Implemented ProductCard, ProductGrid, ProductFilters, ProductSort, ProductSearch, ProductPagination, and ProductSkeleton elements (Phase 5 - Catalog).
- [x] Built the responsive, SEO-optimized Catalog Page `/products` and single Product Detail Page `/products/[slug]`.
- [x] Developed the luxury Persian Homepage storefront at `/` hosting comprehensive structural sections (Phase 6 - Storefront).
- [x] Built the premium, interactive `QuickViewModal.tsx` for dynamic product detail previews directly on the homepage (Phase 6 - Storefront).
- [x] Separated design system demonstration into a clean sandbox route at `/design-system` (Phase 6 - Storefront).

### Current Work
- [x] Static validation and build verifications (0 lint warnings, perfect compilations).
- [ ] Awaiting developer review and instructions for the next phase.

---

## 5. Critical AI Operating Rules & Guidelines

### 5.1 No Redesigns
Never suggest or perform architectural changes, directory reorganizations, or dependency additions without explicit developer instruction. The existing documentation under `docs/` is the single source of truth.

### 5.2 Edit Source, Not Artifacts
Do not edit any build output directories (`.next/`, `out/`, `dist/`). If a file appears to be a build compilation result, trace it to the source inside `src/`.

### 5.3 Verify Your Work
Always inspect files immediately after modifying them. Execute type checking (`npm run build` or `npx tsc`) and linting (`npm run lint`) to guarantee no compilation errors are introduced.

### 5.4 Zero Placeholder Logic
Do not include empty functions, dummy API handlers, mock return statements (unless explicitly requested for demo purposes), or comments like `// TODO: Implement later`. All implemented code must be fully formed, statically typed, and production-ready.

### 5.5 Avoid Large Files & God Components
Maintain high modularity. Every file should have a single responsibility. Large files (exceeding 250 lines) are considered a code smell. Extract visual blocks into localized helper components.
