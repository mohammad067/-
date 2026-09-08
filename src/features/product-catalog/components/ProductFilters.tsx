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
  onReset,
}) => {
  return (
    <Card variant="glass-premium" className="p-6 md:p-8 flex flex-col gap-8 text-right h-fit sticky top-28">
      <div className="flex items-center justify-between border-b border-border/30 pb-4">
        <button
          onClick={onReset}
          className="text-xs text-[#C8A75D] hover:text-[#B79650] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="ریست فیلترها"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          پاک کردن فیلترها
        </button>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-accent" />
          <Typography variant="h3" className="text-lg font-bold">فیلتر رقم و استان</Typography>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h4" className="text-sm font-semibold">ارقام برنج شمال</Typography>
        <div className="flex flex-wrap gap-2">
          {VARIETIES.map((v) => (
            <Badge
              key={v}
              variant={selectedVariety === v || (v === "همه" && selectedVariety === "") ? "accent" : "outline"}
              className="cursor-pointer px-3.5 py-1.5 text-xs transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedVariety(v === "همه" ? "" : v)}
            >
              {v}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Typography variant="h4" className="text-sm font-semibold">استان برداشت</Typography>
        <div className="flex flex-wrap gap-2">
          {PROVINCES.map((p) => (
            <Badge
              key={p}
              variant={selectedProvince === p || (p === "همه" && selectedProvince === "") ? "accent" : "outline"}
              className="cursor-pointer px-3.5 py-1.5 text-xs transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedProvince(p === "همه" ? "" : p)}
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            تا {(maxPrice).toLocaleString("fa-IR")} تومان
          </span>
          <Typography variant="h4" className="text-sm font-semibold">حداکثر بودجه (۱۰ کیلو)</Typography>
        </div>
        <input
          type="range"
          min={700000}
          max={2000000}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-[#C8A75D]"
        />
      </div>
    </Card>
  );
};

ProductFilters.displayName = "ProductFilters";
