import "server-only";

import { cache } from "react";
import type { Product } from "@/features/product-catalog/types";

interface ApiVariant {
  id: string;
  weightGrams: number;
  priceRials: number;
  compareAtPriceRials: number | null;
  availableQuantity: number | null;
  inStock: boolean;
}

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  summary: string | null;
  description: string | null;
  origin: { province: string | null; city: string | null };
  variety: string | null;
  harvestYear: number | null;
  rating: number;
  reviewsCount: number;
  aromaScore: number;
  lengthScore: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  variants: ApiVariant[];
}

function apiUrl(path: string): string {
  const baseUrl = (process.env.LARAVEL_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");
  return `${baseUrl}/${path.replace(/^\//, "")}`;
}

function toProduct(product: ApiProduct): Product {
  const variant = product.variants[0];
  if (!variant) throw new Error(`Product ${product.slug} has no storefront variant.`);

  const currentPrice = variant.priceRials / 10;
  const originalPrice = (variant.compareAtPriceRials ?? variant.priceRials) / 10;
  const discountPercent = originalPrice > currentPrice
    ? Math.round((1 - currentPrice / originalPrice) * 100)
    : undefined;
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];

  return {
    id: product.id,
    variantId: variant.id,
    slug: product.slug,
    name: product.name,
    variety: product.variety ?? "برنج ایرانی",
    province: product.origin.province ?? "شمال ایران",
    harvestYear: (product.harvestYear ?? 0).toLocaleString("fa-IR", { useGrouping: false }),
    weight: `${variant.weightGrams / 1000} کیلوگرم`,
    price: originalPrice,
    discountPercent,
    inStock: variant.inStock,
    stockCount: variant.availableQuantity ?? 0,
    rating: product.rating,
    reviewsCount: product.reviewsCount,
    imageChar: product.variety ?? "برنج",
    imageUrl: primaryImage?.url ?? "/hero-bg.avif",
    summary: product.summary ?? "",
    description: product.description ?? "",
    aromaScore: product.aromaScore,
    lengthScore: product.lengthScore,
    region: product.origin.city ?? "شمال ایران",
  };
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Catalog API returned ${response.status}.`);
  return response.json() as Promise<T>;
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const payload = await request<{ data: ApiProduct[] }>("products?limit=50");
  return payload.data.map(toProduct);
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const response = await fetch(apiUrl(`products/${encodeURIComponent(slug)}`), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Catalog API returned ${response.status}.`);
  const payload = await response.json() as { data: ApiProduct };
  return toProduct(payload.data);
});
