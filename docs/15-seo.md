# SEO & Metadata Architecture

This document outlines the SEO (Search Engine Optimization) and metadata generation strategy for the premium Iranian rice storefront.

## 1. Core Objectives
- Achieve perfect **100/100 Lighthouse SEO** scores.
- Automate dynamic, localized Open Graph (OG) and Twitter card generation.
- Scale structured JSON-LD schema markup for product search enrichment (Rich Snippets).

## 2. Dynamic Metadata Implementation (Next.js 15)
Every dynamic page (e.g., product detail pages `/products/[slug]`) implements Next.js's dynamic `generateMetadata` API to fetch information asynchronously and construct highly descriptive meta tags:

```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  if (!product) return { title: 'محصول یافت نشد | طلای شالیزار' };

  return {
    title: `${product.title} | طلای شالیزار`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.image, alt: product.title }],
    },
  };
}
```

## 3. Rich Schema Markup (JSON-LD)
To secure premium product badges in Google search results, we inject structural JSON-LD metadata for products, ratings, price tiers, and stock availability directly into the server-rendered HTML:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "برنج هاشمی فوق ممتاز گیلان",
    "image": "/images/products/hashemi.jpg",
    "description": "مرغوب‌ترین رقم برنج هاشمی آستانه اشرفیه با عطر ناب و ری‌دهی فوق‌العاده.",
    "brand": {
      "@type": "Brand",
      "name": "طلای شالیزار"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "IRR",
      "price": "13050000",
      "availability": "https://schema.org/InStock"
    }
  }
</script>
```

## 4. Crawl Optimization & Sitemaps
- **Robots.txt**: Rules defined to restrict search spiders from indexing search query parameters (`/products?q=...`) to avoid crawling duplicate pages.
- **Sitemap.xml**: Programmatically constructed via `app/sitemap.ts` to discover new product URLs automatically from the mock/actual server repository.
- **Canonical Tags**: Applied systematically across all layout containers to prevent duplicate URL penalties (e.g., protocol or query string variations).
