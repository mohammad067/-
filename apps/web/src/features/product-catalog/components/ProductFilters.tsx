"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
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

function Chip({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={`min-h-9 px-3 py-1.5 text-xs rounded-full border ${active ? "bg-primary text-white border-primary" : "bg-white border-[#E5E2DA]"}`}
    >
      {label}
    </button>
  );
}

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
        <button type="button" onClick={onReset} className="text-xs text-primary flex items-center gap-1.5 min-h-9">
          <RotateCcw className="w-3.5 h-3.5" />
          پاک کردن
        </button>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" aria-hidden />
          <Typography variant="h3" className="text-lg font-bold">فیلتر</Typography>
        </div>
      </div>
      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="text-sm font-semibold mb-1">رقم</legend>
        <div className="flex flex-wrap gap-2">
          {VARIETIES.map((v) => (
            <Chip key={v} label={v} active={selectedVariety === v || (v === "همه" && selectedVariety === "")} onSelect={() => setSelectedVariety(v === "همه" ? "" : v)} />
          ))}
        </div>
      </fieldset>
      <fieldset className="flex flex-col gap-3 border-0 p-0">
        <legend className="text-sm font-semibold mb-1">استان</legend>
        <div className="flex flex-wrap gap-2">
          {PROVINCES.map((p) => (
            <Chip key={p} label={p} active={selectedProvince === p || (p === "همه" && selectedProvince === "")} onSelect={() => setSelectedProvince(p === "همه" ? "" : p)} />
          ))}
        </div>
      </fieldset>
      <label className="flex items-center justify-between text-sm min-h-11">
        <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-[#2F5D50] w-4 h-4" />
        فقط موجود
      </label>
      <div className="flex flex-col gap-3">
        <label htmlFor="price-range" className="flex justify-between text-sm font-semibold">
          <span>سقف قیمت</span>
          <span className="text-xs font-normal text-muted-foreground">تا {maxPrice.toLocaleString("fa-IR")} تومان</span>
        </label>
        <input id="price-range" type="range" min={700000} max={2000000} step={50000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#2F5D50]" />
      </div>
    </Card>
  );
};

ProductFilters.displayName = "ProductFilters";
