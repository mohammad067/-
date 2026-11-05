import React, { Suspense } from "react";
import { CatalogPageContent } from "@/features/product-catalog/components/CatalogPageContent";
import { MainLayout } from "@/components/layout/MainLayout";
import { Metadata } from "next";
import { getProducts } from "@/lib/server/catalog";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "خرید برنج ایرانی | فروشگاه طلای شالیزار",
  description: "خرید برنج هاشمی، صدری، دم‌سیاه و طارم گیلان و مازندران با اطلاعات مشخص درباره محل کشت، سال برداشت، وزن و قیمت.",
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ wishlist?: string }> }) {
  if ((await searchParams).wishlist === "1") redirect("/wishlist");

  const products = await getProducts();

  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">در حال بارگذاری محصولات…</div>}>
        <CatalogPageContent products={products} />
      </Suspense>
    </MainLayout>
  );
}
