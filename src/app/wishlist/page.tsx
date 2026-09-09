"use client";

import React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductCard } from "@/features/product-catalog/components/ProductCard";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { useCatalogStore } from "@/features/product-catalog/store";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  const wishlist = useCatalogStore((s) => s.wishlist);
  const items = MOCK_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-12 text-right" dir="rtl">
        <h1 className="text-xl md:text-2xl font-bold mb-6">علاقه‌مندی</h1>
        {items.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">لیست خالی است.</p>
            <Link href="/products"><Button variant="primary">فروشگاه</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
