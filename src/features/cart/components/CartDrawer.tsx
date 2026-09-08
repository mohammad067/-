"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, setIsCheckoutOpen } = useCatalogStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  if (!mounted) return null;

  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/30" />
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="w-screen max-w-md bg-[#F8F6F2] text-[#1E2522] border-r border-[#E5E2DA] shadow-xl flex flex-col h-full">
              <div className="px-5 py-4 border-b border-[#E5E2DA] flex items-center justify-between">
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-white" aria-label="بستن">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{itemsCount.toLocaleString("fa-IR")}</Badge>
                  <Typography variant="h3" className="text-base font-bold">سبد خرید</Typography>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <ShoppingBag className="w-8 h-8 text-primary mb-4" />
                    <p className="font-bold mb-2">سبد خالی است</p>
                    <p className="text-sm text-muted-foreground mb-6">یک رقم از فروشگاه انتخاب کنید.</p>
                    <Button variant="primary" onClick={() => setIsCartOpen(false)} className="gap-2">
                      <ArrowRight className="w-4 h-4" />
                      مشاهده محصولات
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-3 border-b border-[#E5E2DA]">
                        <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-600" aria-label="حذف">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.weight}</p>
                          <p className="text-sm font-semibold text-primary mt-1">{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</p>
                        </div>
                        <div className="flex flex-col items-center bg-white border border-[#E5E2DA] rounded-full px-1 py-1">
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-3.5 h-3.5" /></button>
                          <span className="text-xs font-bold py-1">{item.quantity.toLocaleString("fa-IR")}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="px-5 py-5 border-t border-[#E5E2DA] bg-white space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">{subtotal.toLocaleString("fa-IR")} تومان</span>
                    <span>جمع سبد</span>
                  </div>
                  <Button variant="primary" size="lg" className="w-full" onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}>
                    ادامه سفارش
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

CartDrawer.displayName = "CartDrawer";
