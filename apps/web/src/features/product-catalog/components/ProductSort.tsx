"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";

interface ProductSortProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const ProductSort: React.FC<ProductSortProps> = ({ sortBy, setSortBy }) => {
  return (
    <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-[#E5E2DA] text-sm">
      <span className="text-xs text-muted-foreground pr-3">مرتب‌سازی</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-transparent text-foreground text-xs font-medium pl-6 pr-2 py-1.5 focus:outline-none cursor-pointer"
      >
        <option value="default">پیش‌فرض فهرست</option>
        <option value="price-asc">ارزان‌تر</option>
        <option value="price-desc">گران‌تر</option>
        <option value="rating-desc">بالاترین امتیاز</option>
        <option value="name">نام رقم</option>
      </select>
      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground ml-2" />
    </div>
  );
};

ProductSort.displayName = "ProductSort";
