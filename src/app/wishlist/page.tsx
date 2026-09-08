"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/features/product-catalog/components/ProductCard";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { useCatalogStore } from "@/features/product-catalog/store";

export default function WishlistPage() {
  const ids = useCatalogStore((s) => s.wishlist);
  const items = MOCK_PRODUCTS.filter((p) => ids.includes(p.id));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 text-right">
        <h1 className="text-3xl font-bold mb-2">علاقه‌مندی</h1>
        <p className="text-sm text-muted-foreground mb-8">این لیست روی همین مرورگر نگه داشته می‌شود.</p>
        {items.length === 0 ? (
          <div className="bg-white border border-[#E5E2DA] rounded-2xl p-10 text-center">
            <p className="mb-4">هنوز محصولی ذخیره نشده.</p>
            <Link href="/products" className="text-primary text-sm">رفتن به فروشگاه</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
