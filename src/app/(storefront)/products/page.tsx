import React, { Suspense } from "react";
import { CatalogPageContent } from "@/features/product-catalog/components/CatalogPageContent";
import { MainLayout } from "@/components/layout/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ارقام برنج لوکس ایرانی | فروشگاه طلای شالیزار",
  description: "خرید بی‌واسطه مرغوب‌ترین برنج‌های هاشمی، صدری، دم‌سیاه و طارم معطر گیلان و مازندران با بسته‌بندی نفیس و ضمانت اصالت فیزیکی.",
};

export default function ProductsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">در حال بارگذاری محصولات…</div>}>
        <CatalogPageContent />
      </Suspense>
    </MainLayout>
  );
}
