"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface ProductSortProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex items-center gap-3 bg-white/20 dark:bg-black/5 p-2 rounded-full border border-border/40 text-sm">
      <span className="text-xs text-muted-foreground pr-3 font-light">مرتب‌سازی:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-transparent text-foreground text-xs font-medium pl-6 pr-2 py-1.5 focus:outline-none cursor-pointer"
      >
        <option value="default" className="bg-background text-foreground">جدیدترین ارقام برداشت</option>
        <option value="price-asc" className="bg-background text-foreground">ارزان‌ترین محصولات</option>
        <option value="price-desc" className="bg-background text-foreground">گران‌ترین محصولات</option>
        <option value="rating-desc" className="bg-background text-foreground">بالاترین امتیاز مشتریان</option>
      </select>
      <div className="pl-3 text-muted-foreground flex items-center justify-center">
        <ArrowUpDown className="w-3.5 h-3.5 stroke-1.5" />
      </div>
    </div>
  );
};

ProductSort.displayName = "ProductSort";
