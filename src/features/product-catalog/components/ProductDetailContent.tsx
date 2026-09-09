"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, ShoppingBag, Check, Heart, Minus, Plus } from "lucide-react";
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

const FAQS = [
  { q: "این برنج مخلوط است؟", a: "خیر. هر کیسه یک رقم است با منطقه مشخص در گیلان یا مازندران." },
  { q: "سال برداشت کدام است؟", a: "برداشت ۱۴۰۴ روی کیسه نوشته شده." },
  { q: "چطور بپزم؟", a: "کرایه بر اساس وزن کل سبد و استان گیرنده حساب می‌شود." },
  { q: "اگر از پخت راضی نبودم چی؟", a: "پیگیری می‌کنیم. ادعای آزمایشگاه یا ارگانیک نداریم." },
];

export const ProductDetailContent: React.FC<{ product: Product }> = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart } = useCatalogStore();
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const weights = useMemo(
    () => MOCK_PRODUCTS.filter((p) => p.variety === product.variety && p.region === product.region),
    [product]
  );
  const active = weights.find((p) => p.id === product.id) || product;
  const gallery = [active.imageUrl, ...EXTRA_SHOTS.filter((url) => url !== active.imageUrl)];
  const price = active.discountPercent ? active.price * (1 - active.discountPercent / 100) : active.price;
  const related = MOCK_PRODUCTS.filter((p) => p.id !== active.id && p.province === active.province).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 text-right">
      <nav className="text-xs text-muted-foreground flex items-center gap-2 mb-8 flex-wrap">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">فروشگاه</Link>
        <span>/</span>
        <Link href={`/products?variety=${encodeURIComponent(active.variety)}`} className="hover:text-primary">{active.variety}</Link>
        <span>/</span>
        <span className="text-foreground">{active.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <div className="relative h-[380px] md:h-[500px] rounded-3xl overflow-hidden bg-[#EFE8DC] border border-[#E5E2DA]">
            <img src={gallery[shot]} alt={active.name} className="w-full h-full object-cover" />
            {active.discountPercent ? (
              <Badge variant="warning" className="absolute top-4 right-4">{active.discountPercent.toLocaleString("fa-IR")} ٪</Badge>
            ) : null}
            <Badge variant={active.inStock ? "success" : "warning"} className="absolute top-4 left-4">
              {active.inStock ? "موجود" : "ناموجود"}
            </Badge>
          </div>
          <div className="flex gap-2 mt-3 justify-start">
            {gallery.map((url, i) => (
              <button key={url} type="button" onClick={() => setShot(i)} className={`h-20 w-20 rounded-xl overflow-hidden border ${shot === i ? "border-primary" : "border-[#E5E2DA]"}`}>
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {active.province}، {active.region}
          </p>
          <Typography variant="serif-title" className="text-3xl md:text-4xl font-bold leading-tight">{active.name}</Typography>
          <p className="text-sm text-muted-foreground">{active.summary}</p>
          <button type="button" onClick={() => toggleWishlist(active.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground w-fit">
            <Heart className={`w-4 h-4 ${wishlist.includes(active.id) ? "text-red-500 fill-red-500" : ""}`} /> علاقه‌مندی
          </button>

          <div>
            <p className="text-xs font-semibold mb-2">وزن / بسته‌بندی</p>
            <div className="flex gap-2 flex-wrap">
              {(weights.length > 1 ? weights : [active]).map((w) => (
                <Link
                  key={w.id}
                  href={`/products/${w.slug}`}
                  className={`text-sm rounded-full border px-4 py-2 ${w.id === active.id ? "bg-primary text-white border-primary" : "bg-white border-[#E5E2DA]"}`}
                >
                  {w.weight}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">قیمت</p>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-primary">{price.toLocaleString("fa-IR")} تومان</span>
              {active.discountPercent ? (
                <span className="text-sm line-through text-muted-foreground">{active.price.toLocaleString("fa-IR")}</span>
              ) : null}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">تعداد</p>
            <div className="inline-flex items-center gap-3 border border-[#E5E2DA] rounded-full px-3 py-2 bg-white">
              <button type="button" aria-label="افزایش" onClick={() => setQty((n) => n + 1)}><Plus className="w-4 h-4" /></button>
              <span className="w-8 text-center">{qty.toLocaleString("fa-IR")}</span>
              <button type="button" aria-label="کاهش" onClick={() => setQty((n) => Math.max(1, n - 1))}><Minus className="w-4 h-4" /></button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            disabled={!active.inStock}
            className="w-full md:w-auto"
            onClick={() => {
              for (let i = 0; i < qty; i += 1) {
                addToCart({ id: active.id, name: active.name, price, weight: active.weight, imageChar: active.imageChar });
              }
              setAdded(true);
            }}
          >
            {active.inStock ? (added ? <><Check className="w-4 h-4" /> اضافه شد</> : <><ShoppingBag className="w-4 h-4" /> افزودن به سبد</>) : "این محصول ناموجود است"}
          </Button>
        </div>
      </div>

      <section className="mt-14 space-y-4 text-sm leading-8 text-[#3A4540]">
        <h2 className="text-xl font-bold text-foreground">توضیحات محصول</h2>
        <p>{active.description} {active.summary} این کیسه برای سفره روزانه و پخت مهمانی مناسب است.</p>
        <p>رقم {active.variety} از {active.region} در {active.province} برداشت {active.harvestYear} است. مخلوط شهری نیست.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">جدول مشخصات محصول</h2>
        <div className="overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white">
          {[
            ["نوع محصول", `برنج ${active.variety}`],
            ["منطقه", `${active.province}، ${active.region}`],
            ["سال برداشت", active.harvestYear],
            ["وزن بسته", active.weight],
            ["وضعیت", active.inStock ? "موجود" : "ناموجود"],
            ["عطر (نظر خریدار)", `${active.aromaScore.toLocaleString("fa-IR")} از ۵`],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-2 border-b border-[#E5E2DA] last:border-0 text-sm">
              <div className="p-3 bg-[#F8F6F2] font-semibold">{k}</div>
              <div className="p-3">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">پرسش‌های متداول</h2>
        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <button
              key={item.q}
              type="button"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-right bg-white border border-[#E5E2DA] rounded-2xl px-4 py-3"
            >
              <p className="font-semibold text-sm">{item.q}</p>
              {openFaq === i && <p className="text-sm text-muted-foreground mt-2 leading-7">{item.a}</p>}
            </button>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-6">محصولات مرتبط</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

ProductDetailContent.displayName = "ProductDetailContent";
