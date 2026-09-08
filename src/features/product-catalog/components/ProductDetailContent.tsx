"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ShoppingBag, ArrowRight, Check, Heart, Minus, Plus } from "lucide-react";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Product } from "../types";
import { useCatalogStore } from "../store";
import { MOCK_PRODUCTS } from "../data/products";
import { ProductCard } from "./ProductCard";

const EXTRA_SHOTS = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
];

export const ProductDetailContent: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);

  const weights = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.variety === product.variety && p.region === product.region),
    [product]
  );
  const active = weights.find((p) => p.id === product.id) || product;
  const gallery = [active.imageUrl, ...EXTRA_SHOTS.filter((url) => url !== active.imageUrl)];
  const price = active.discountPercent ? active.price * (1 - active.discountPercent / 100) : active.price;
  const related = MOCK_PRODUCTS.filter(
    (p) => p.id !== active.id && p.variety !== active.variety && p.province === active.province
  ).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-10 text-right">
      <nav className="text-xs text-muted-foreground flex items-center gap-2 mb-6 justify-start flex-wrap">
        <Link href="/products" className="hover:text-primary flex items-center gap-1">
          <ArrowRight className="w-3.5 h-3.5" /> فروشگاه
        </Link>
        <span>/</span>
        <Link href={`/products?variety=${encodeURIComponent(active.variety)}`} className="hover:text-primary">
          {active.variety}
        </Link>
        <span>/</span>
        <span className="text-foreground">{active.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="relative h-[360px] md:h-[460px] rounded-3xl overflow-hidden bg-[#EFE8DC] border border-[#E5E2DA]">
            <img src={gallery[shot]} alt={active.name} className="w-full h-full object-cover" />
            <Badge variant={active.inStock ? "success" : "warning"} className="absolute top-4 left-4">
              {active.inStock ? "موجود" : "ناموجود"}
            </Badge>
          </div>
          <div className="flex gap-2 mt-3 justify-end">
            {gallery.map((url, i) => (
              <button key={url} type="button" onClick={() => setShot(i)} className={`h-16 w-16 rounded-xl overflow-hidden border ${shot === i ? "border-primary" : "border-[#E5E2DA]"}`}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {active.province}، {active.region}
          </p>
          <Typography variant="serif-title" className="text-3xl font-bold leading-tight">{active.name}</Typography>
          <button onClick={() => toggleWishlist(active.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground w-fit" type="button">
            <Heart className={`w-4 h-4 ${wishlist.includes(active.id) ? "text-red-500 fill-red-500" : ""}`} />
            علاقه‌مندی
          </button>
          <p className="text-sm text-muted-foreground leading-relaxed">{active.description}</p>

          {weights.length > 1 && (
            <div>
              <p className="text-xs font-semibold mb-2">وزن کیسه</p>
              <div className="flex gap-2 justify-end flex-wrap">
                {weights.map((w) => (
                  <Link
                    key={w.id}
                    href={`/products/${w.slug}`}
                    className={`text-xs rounded-full border px-3 py-1.5 ${w.id === active.id ? "bg-primary text-white border-primary" : "bg-white border-[#E5E2DA]"}`}
                  >
                    {w.weight}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white border border-[#E5E2DA] rounded-xl p-3">
              <span className="text-muted-foreground block">رقم</span>
              <span className="font-bold">{active.variety}</span>
            </div>
            <div className="bg-white border border-[#E5E2DA] rounded-xl p-3">
              <span className="text-muted-foreground block">سال برداشت</span>
              <span className="font-bold">{active.harvestYear}</span>
            </div>
            <div className="bg-white border border-[#E5E2DA] rounded-xl p-3">
              <span className="text-muted-foreground block">وزن</span>
              <span className="font-bold">{active.weight}</span>
            </div>
            <div className="bg-white border border-[#E5E2DA] rounded-xl p-3">
              <span className="text-muted-foreground block">عطر (تجربه خریدار)</span>
              <span className="font-bold">{active.aromaScore.toLocaleString("fa-IR")} از ۵</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">این امتیاز آزمایشگاه نیست؛ از نظر خریدارهاست.</p>

          <div className="flex items-center justify-between gap-4 bg-white border border-[#E5E2DA] rounded-2xl p-4 flex-wrap">
            <span className="text-xl font-bold text-primary">{price.toLocaleString("fa-IR")} تومان</span>
            <div className="flex items-center gap-2 border border-[#E5E2DA] rounded-full px-2 py-1">
              <button type="button" onClick={() => setQty((n) => n + 1)} aria-label="افزایش"><Plus className="w-4 h-4" /></button>
              <span className="w-6 text-center text-sm">{qty.toLocaleString("fa-IR")}</span>
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="کاهش"><Minus className="w-4 h-4" /></button>
            </div>
            <Button
              variant="primary"
              size="lg"
              disabled={!active.inStock}
              onClick={() => {
                for (let i = 0; i < qty; i += 1) {
                  addToCart({ id: active.id, name: active.name, price, weight: active.weight, imageChar: active.imageChar });
                }
                setAdded(true);
              }}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {active.inStock ? (added ? "اضافه شد" : "افزودن به سبد") : "ناموجود"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-[#E5E2DA]">
          <Typography variant="serif-title" className="text-2xl font-bold mb-8">سایر ارقام همان استان</Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ProductDetailContent.displayName = "ProductDetailContent";
