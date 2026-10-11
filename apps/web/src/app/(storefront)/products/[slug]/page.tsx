import React from "react";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductDetailContent } from "@/features/product-catalog/components/ProductDetailContent";
import { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/server/catalog";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic page title metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

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
  const [product, products] = await Promise.all([
    getProduct(resolvedParams.slug),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <MainLayout>
      <ProductDetailContent product={product} products={products} />
    </MainLayout>
  );
}
