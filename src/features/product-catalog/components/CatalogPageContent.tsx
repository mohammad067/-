"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { ProductSort } from "./ProductSort";
import { ProductSearch } from "./ProductSearch";
import { MOCK_PRODUCTS } from "../data/products";
import { useCatalogStore } from "../store";

export const CatalogPageContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedVariety, setSelectedVariety] = useState(searchParams.get("variety") || "");
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get("province") || "");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("default");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showWishlist, setShowWishlist] = useState(searchParams.get("wishlist") === "1");
  const focusSearch = searchParams.get("focus") === "search";
  const wishlist = useCatalogStore((state) => state.wishlist);

  useEffect(() => {
    setSelectedVariety(searchParams.get("variety") || "");
    setSelectedProvince(searchParams.get("province") || "");
    setSearchQuery(searchParams.get("q") || "");
    setShowWishlist(searchParams.get("wishlist") === "1");
  }, [searchParams]);

  const syncUrl = (variety: string, province: string, q: string) => {
    const params = new URLSearchParams();
    if (variety) params.set("variety", variety);
    if (province) params.set("province", province);
    if (q) params.set("q", q);
    const qs = params.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
  };

  const onResetFilters = () => {
    setSelectedVariety("");
    setSelectedProvince("");
    setMaxPrice(2000000);
    setSearchQuery("");
    setSortBy("default");
    setInStockOnly(false);
    setShowWishlist(false);
    router.replace("/products", { scroll: false });
  };

  const unitPrice = (p: (typeof MOCK_PRODUCTS)[number]) =>
    p.discountPercent ? p.price * (1 - p.discountPercent / 100) : p.price;

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];
    if (showWishlist) result = result.filter((p) => wishlist.includes(p.id));
    if (selectedVariety) result = result.filter((p) => p.variety === selectedVariety);
    if (selectedProvince) result = result.filter((p) => p.province === selectedProvince);
    if (inStockOnly) result = result.filter((p) => p.inStock);
    result = result.filter((p) => unitPrice(p) <= maxPrice);
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      result = result.filter(
        (p) =>
          p.name.includes(q) ||
          p.province.includes(q) ||
          p.region.includes(q) ||
          p.variety.includes(q) ||
          p.summary.includes(q) ||
          p.description.includes(q)
      );
    }
    if (sortBy === "price-asc") result.sort((a, b) => unitPrice(a) - unitPrice(b));
    else if (sortBy === "price-desc") result.sort((a, b) => unitPrice(b) - unitPrice(a));
    else if (sortBy === "rating-desc") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    return result;
  }, [selectedVariety, selectedProvince, maxPrice, searchQuery, sortBy, showWishlist, wishlist, inStockOnly]);

  return (
    <Section className="py-8 md:py-16">
      <Container>
        <div className="flex flex-col gap-2 mb-8 text-right">
          <Badge variant="primary" className="w-fit self-end">فروشگاه برنج شمال</Badge>
          <Typography variant="serif-title" className="text-2xl md:text-5xl font-bold mt-2">برنج شمال؛ گیلان و مازندران</Typography>
          <p className="text-xs text-muted-foreground">{filteredProducts.length.toLocaleString("fa-IR")} محصول</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-3 md:p-4 rounded-2xl border border-[#E5E2DA]">
          <ProductSort sortBy={sortBy} setSortBy={setSortBy} />
          <ProductSearch autoFocus={focusSearch} searchQuery={searchQuery} setSearchQuery={(v) => { setSearchQuery(v); syncUrl(selectedVariety, selectedProvince, v); }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 min-h-[400px]">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState title="رقمی پیدا نشد" description="فیلتر را عوض کنید یا پاک کنید." action={<Button variant="primary" onClick={onResetFilters}>پاک کردن فیلتر</Button>} />
            )}
          </div>
          <div className="order-first lg:order-last">
            <ProductFilters
              selectedVariety={selectedVariety}
              setSelectedVariety={(v) => { setSelectedVariety(v); syncUrl(v, selectedProvince, searchQuery); }}
              selectedProvince={selectedProvince}
              setSelectedProvince={(v) => { setSelectedProvince(v); syncUrl(selectedVariety, v, searchQuery); }}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onReset={onResetFilters}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

CatalogPageContent.displayName = "CatalogPageContent";
