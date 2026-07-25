# Changelog

All notable changes to the **Rice Shop** project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Created foundational architectural documentation inside `docs/` covering SEO (`15-seo.md`), Authentication (`16-authentication.md`), Error Handling (`17-error-handling.md`), Performance Optimization (`18-performance.md`), AI Context (`19-ai-context.md`), Tasks Tracker (`21-tasks.md`), and Dependency Graphs (`22-dependency-graph.md`).
- Initialized Next.js 15, React 19, and Tailwind CSS v4 environment.
- Configured absolute import path mappings (`@/*`) in `tsconfig.json`.
- Scaffolded physical directory tree exactly matching `docs/03-folder-structure.md` and added explanatory `README.md` to every directory.
- Created reusable high-end design system primitives (Typography, Button, Card, Input, Badge, Glass overlay, LoadingState, EmptyState, ErrorState).
- Built the fully responsive, luxurious application shell including a floating Glassmorphism Navbar and clean editorial Footer.
- Designed a dramatic, cinematic fullscreen Hero Section celebrating premium organic Iranian rice.
- Implemented interactive component demonstrations and system-state togglers (Loading, Empty, and Error States) inside the main homepage path (`src/app/page.tsx`).
- Created modular layout primitives: `Container.tsx`, `Section.tsx`, `MaxWidth.tsx`, `PageWrapper.tsx`, and `MainLayout.tsx`.
- Implemented App Router layout segments: `loading.tsx` (Loading Layout), `error.tsx` (Error Layout), and `not-found.tsx` (Not Found Layout).
- Created functional E2E test scripts inside `tests/storefront.spec.ts` supporting full multi-state validation under Playwright.
- Implemented the complete, production-ready Product Catalog feature under Feature-Based Architecture constraints.
- Developed ProductCard, ProductGrid, ProductFilters, ProductSort, ProductSearch, ProductPagination, and ProductSkeleton primitives under `src/features/product-catalog/components/`.
- Configured the robust `/products` catalog listing view and single `/products/[slug]` detail page with full dynamic SEO metadata support.
- Implemented the premium, immersive Persian storefront homepage experience (`src/app/page.tsx`) incorporating the Hero, Featured Grid, Values, Categories, Editorial, Testimonials, Newsletter, and Social preview layouts.
- Designed and built the interactive `QuickViewModal.tsx` overlay to allow fast, elegant micro-previews of product metadata.
- Migrated the design system demonstration sandbox to `/design-system/page.tsx`.
