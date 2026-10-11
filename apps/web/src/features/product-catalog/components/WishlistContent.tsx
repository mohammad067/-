"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCatalogStore } from "../store";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";

export function WishlistContent({ products }: { products: Product[] }) {
  const wishlist = useCatalogStore((state) => state.wishlist);
  const items = products.filter((product) => wishlist.includes(product.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-right" dir="rtl">
      <h1 className="text-xl md:text-2xl font-bold mb-6">علاقه‌مندی</h1>
      {items.length === 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">لیست خالی است.</p>
          <Link href="/products"><Button variant="primary">فروشگاه</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
