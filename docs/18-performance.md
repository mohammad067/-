# Performance Optimization & Core Web Vitals

This document specifies the strategies applied to ensure ultra-fast loading times, maintaining a premium, "Apple-level" smooth user experience.

## 1. Zero-JS Animation Strategy
- **Framer Motion Orchestration**: We use Framer Motion in a highly structured, performance-sensitive fashion. Layout animations are offloaded to CSS transitions and CSS transforms where possible.
- **Hardware Acceleration**: GPU acceleration is forced for large transition triggers by utilizing properties like `transform: translate3d(0, 0, 0)`.

## 2. Image Optimization (Next.js Image)
All luxury product pictures and background assets are processed and rendered using the Next.js `<Image />` component:
- **AVIF / WebP Formats**: Automated delivery of highly compressed modern formats based on browser capabilities.
- **Dynamic Srcsets**: Automated scaling of images to match device widths, preventing desktop-sized assets from overloading mobile devices.
- **Priority Loading**: Above-the-fold hero background images utilize the `priority` tag to eliminate Largest Contentful Paint (LCP) delays.

## 3. Server-Side Rendering (SSR) & Dynamic Streaming
- **Server Components as Default**: All layout structures, navigation footers, and initial grids are generated directly on the server. Client-side JS bundle sizes remain exceptionally light.
- **Suspense-Driven Streaming**: Parts of the catalog are streamed dynamically using React Suspense wrappers. This allows the core page shell to load instantly, while slower network-bound components render progressively.

## 4. Code Splitting & Tree Shaking
- **Dynamic Imports**: Interactive, heavy elements (like the `QuickViewModal` or complex filter components) are split out and loaded on-demand via `next/dynamic`.
- **Icon Optimization**: We only import specific icons from `lucide-react` using modular ES-import syntax to ensure optimal tree-shaking results.
