import React from "react";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductDetailContent } from "@/features/product-catalog/components/ProductDetailContent";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic page title metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return {
      title: "محصول یافت نشد | طلای شالیزار",
    };
  }

  return {
    title: `${product.name} | فروشگاه طلای شالیزار`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <MainLayout>
      <ProductDetailContent product={product} />
    </MainLayout>
  );
}
