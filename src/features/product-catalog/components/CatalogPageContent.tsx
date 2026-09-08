"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import { ProductPagination } from "./ProductPagination";
import { MOCK_PRODUCTS } from "../data/products";
import { Flame } from "lucide-react";
import { useCatalogStore } from "../store";

export const CatalogPageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedVariety, setSelectedVariety] = useState(searchParams.get("variety") || "");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [showWishlist, setShowWishlist] = useState(searchParams.get("wishlist") === "1");
  const focusSearch = searchParams.get("focus") === "search";
  const wishlist = useCatalogStore((state) => state.wishlist);

  const onResetFilters = () => {
    setSelectedVariety("");
    setSelectedProvince("");
    setMaxPrice(2000000);
    setSearchQuery("");
    setSortBy("default");
    setCurrentPage(1);
    setShowWishlist(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];
    if (showWishlist) result = result.filter((p) => wishlist.includes(p.id));
    if (selectedVariety) result = result.filter((p) => p.variety === selectedVariety);
    if (selectedProvince) result = result.filter((p) => p.province === selectedProvince);
    result = result.filter((p) => {
      const finalPrice = p.discountPercent ? p.price * (1 - p.discountPercent / 100) : p.price;
      return finalPrice <= maxPrice;
    });
    if (searchQuery.trim()) {
      const cleanQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.province.toLowerCase().includes(cleanQuery) ||
          p.region.toLowerCase().includes(cleanQuery)
      );
    }
    if (sortBy === "price-asc") {
      result.sort((a, b) => {
        const pA = a.discountPercent ? a.price * (1 - a.discountPercent / 100) : a.price;
        const pB = b.discountPercent ? b.price * (1 - b.discountPercent / 100) : b.price;
        return pA - pB;
      });
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => {
        const pA = a.discountPercent ? a.price * (1 - a.discountPercent / 100) : a.price;
        const pB = b.discountPercent ? b.price * (1 - b.discountPercent / 100) : b.price;
        return pB - pA;
      });
    } else if (sortBy === "rating-desc") {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [selectedVariety, selectedProvince, maxPrice, searchQuery, sortBy, showWishlist, wishlist]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <Section className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-2 mb-12 text-right">
          <Badge variant="primary" className="w-fit self-end gap-1 px-3 py-1 bg-primary/10 text-primary">
            <Flame className="w-3.5 h-3.5 text-accent" />
            انتخاب مستقیم از شالیزار شمال
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            برنج شمال؛ گیلان و مازندران
          </Typography>
          <Typography variant="body" className="max-w-2xl text-muted-foreground mt-2 leading-relaxed">
            هاشمی، طارم، صدری، دم‌سیاه، فجر و شیرودی از گیلان و مازندران. قهوه‌ای همان رقم هاشمی است، نه رقم جدا.
          </Typography>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white/20 dark:bg-black/5 p-4 rounded-3xl border border-border/40 text-right w-full">
          <ProductSort sortBy={sortBy} setSortBy={(v) => { setSortBy(v); setCurrentPage(1); }} />
          <ProductSearch autoFocus={focusSearch} searchQuery={searchQuery} setSearchQuery={(v) => { setSearchQuery(v); setCurrentPage(1); }} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 flex flex-col justify-between min-h-[500px]">
            {paginatedProducts.length > 0 ? (
              <div className="flex flex-col justify-between h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <ProductPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <EmptyState
                  title="رقمی با این فیلتر پیدا نشد"
                  description="فیلتر رقم یا استان را عوض کنید."
                  action={
                    <Button variant="accent" onClick={onResetFilters}>
                      پاک کردن فیلتر
                    </Button>
                  }
                />
              </div>
            )}
          </div>
          <div className="order-first lg:order-last">
            <ProductFilters
              selectedVariety={selectedVariety}
              setSelectedVariety={(v) => { setSelectedVariety(v); setCurrentPage(1); }}
              selectedProvince={selectedProvince}
              setSelectedProvince={(v) => { setSelectedProvince(v); setCurrentPage(1); }}
              maxPrice={maxPrice}
              setMaxPrice={(v) => { setMaxPrice(v); setCurrentPage(1); }}
              onReset={onResetFilters}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

CatalogPageContent.displayName = "CatalogPageContent";
