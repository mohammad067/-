"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Filter, RotateCcw } from "lucide-react";

interface ProductFiltersProps {
  selectedVariety: string;
  setSelectedVariety: (variety: string) => void;
  selectedProvince: string;
  setSelectedProvince: (province: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  onReset: () => void;
}

const VARIETIES = ["همه", "هاشمی", "صدری", "دم‌سیاه", "طارم", "فجر", "شیرودی"];
const PROVINCES = ["همه", "گیلان", "مازندران"];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedVariety,
  setSelectedVariety,
  selectedProvince,
  setSelectedProvince,
  maxPrice,
  setMaxPrice,
  inStockOnly,
  setInStockOnly,
  onReset,
}) => {
  return (
    <Card className="p-6 flex flex-col gap-7 text-right h-fit sticky top-28 bg-white border border-[#E5E2DA]">
      <div className="flex items-center justify-between border-b border-[#E5E2DA] pb-4">
        <button onClick={onReset} className="text-xs text-primary flex items-center gap-1.5" type="button">
          <RotateCcw className="w-3.5 h-3.5" />
          پاک کردن
        </button>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          <Typography variant="h3" className="text-lg font-bold">فیلتر</Typography>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h4" className="text-sm font-semibold">رقم</Typography>
        <div className="flex flex-wrap gap-2">
          {VARIETIES.map((v) => (
            <Badge
              key={v}
              variant={selectedVariety === v || (v === "همه" && selectedVariety === "") ? "primary" : "outline"}
              className="cursor-pointer px-3 py-1.5 text-xs"
              onClick={() => setSelectedVariety(v === "همه" ? "" : v)}
            >
              {v}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h4" className="text-sm font-semibold">استان</Typography>
        <div className="flex flex-wrap gap-2">
          {PROVINCES.map((p) => (
            <Badge
              key={p}
              variant={selectedProvince === p || (p === "همه" && selectedProvince === "") ? "primary" : "outline"}
              className="cursor-pointer px-3 py-1.5 text-xs"
              onClick={() => setSelectedProvince(p === "همه" ? "" : p)}
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      <label className="flex items-center justify-between text-sm cursor-pointer">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-[#2F5D50]" />
        فقط موجود
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">تا {maxPrice.toLocaleString("fa-IR")} تومان</span>
          <Typography variant="h4" className="text-sm font-semibold">سقف قیمت</Typography>
        </div>
        <input
          type="range"
          min={700000}
          max={2000000}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-[#2F5D50]"
        />
      </div>
    </Card>
  );
};

ProductFilters.displayName = "ProductFilters";
