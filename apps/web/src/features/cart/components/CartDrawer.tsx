"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, setIsCheckoutOpen } = useCatalogStore();
  const trapRef = useFocusTrap(isCartOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isCartOpen, setIsCartOpen]);
  if (!mounted || !isCartOpen) return null;

  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
      <div className="fixed inset-0 bg-black/30" onClick={() => setIsCartOpen(false)} />
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div ref={trapRef} role="dialog" aria-modal="true" aria-labelledby="cart-title" className="w-screen max-w-md bg-[#F8F6F2] text-[#1E2522] border-r border-[#E5E2DA] shadow-xl flex flex-col h-full">
          <div className="px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Typography variant="h3" id="cart-title" className="text-base font-bold">سبد خرید</Typography>
              <Badge variant="primary">{itemsCount.toLocaleString("fa-IR")}</Badge>
            </div>
            <button type="button" onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-white min-h-11 min-w-11" aria-label="بستن سبد">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <ShoppingBag className="w-8 h-8 text-primary mb-4" aria-hidden />
                <p className="font-bold mb-2">سبد خالی است</p>
                <Button variant="primary" onClick={() => setIsCartOpen(false)} className="gap-2">
                  <ArrowRight className="w-4 h-4" aria-hidden /> مشاهده محصولات
                </Button>
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3 border-b border-[#E5E2DA]">
                    <div className="flex-1 text-right">
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.weight}</p>
                      <p className="text-sm font-semibold text-primary mt-1">{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-white border border-[#E5E2DA] rounded-full px-2 py-1">
                      <button type="button" aria-label={`کاهش ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-5 text-center text-xs font-bold" aria-live="polite">{item.quantity.toLocaleString("fa-IR")}</span>
                      <button type="button" aria-label={`افزایش ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="min-h-11 min-w-11 text-muted-foreground hover:text-red-600" aria-label={`حذف ${item.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cart.length > 0 && (
            <div className="px-5 py-5 border-t border-[#E5E2DA] bg-white space-y-3">
              <div className="flex justify-between text-sm">
                <span>جمع سبد</span>
                <span className="font-bold">{subtotal.toLocaleString("fa-IR")} تومان</span>
              </div>
              <Button variant="primary" size="lg" className="w-full" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>
                ادامه سفارش
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CartDrawer.displayName = "CartDrawer";
