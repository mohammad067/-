# Performance & Core Web Vitals targets

This document establishes concrete optimization parameters to ensure the premium rice storefront delivers a cinematic, lightning-fast shopping experience.

## 1. Metric Thresholds
We track and enforce strict targets for modern Core Web Vitals:

| Metric | Full Form | Goal | Strategy |
|--------|-----------|------|----------|
| **LCP** | Largest Contentful Paint | **< 1.8s** | Hero image preloading, inline CSS variables, modern AVIF support. |
| **INP** | Interaction to Next Paint | **< 100ms** | Framer motion hardware acceleration, debounced inputs. |
| **CLS** | Cumulative Layout Shift | **0.00** | Strict dimension bounds on product cards, skeleton templates. |

## 2. Media Optimization Rules
Since rice varieties and luxury product listings require rich visual imagery:
- **AVIF / WebP Formats**: All graphics must be formatted in next-gen `.webp` or `.avif` extensions for optimal byte compression.
- **Next.js Image (`next/image`) Component**: Absolute replacement of standard `<img>` tags. This ensures automatic device-specific resizing, lazy-loading, and responsive placeholder generation.
- **Priority Loading**: Hero and critical layout banners must declare the `priority` flag to prefetch above-the-fold assets immediately.

```typescript
import Image from 'next/image';

export function PremiumBanner() {
  return (
    <Image
      src="/images/hero-shali.webp"
      alt="Premium Iranian Rice Fields"
      fill
      priority
      className="object-cover"
      sizes="100vw"
    />
  );
}
```

## 3. Bundle Slicing & Dynamic Imports
- **Code Splitting**: Dynamic components that are conditionally loaded (such as the interactive `QuickViewModal` or complex filter options) are split via `next/dynamic` to minimize initial bundle size.
- **Framer Motion**: Animations are built using `motion.div` from standard library paths, keeping bundle weight minimized through tree-shaking support.
