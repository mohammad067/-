"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, ShieldCheck, Tag } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    setIsCheckoutOpen,
  } = useCatalogStore();

  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatches using a standard non-blocking timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Calculate prices
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Mock shipping logic: FREE for orders above 3,000,000 T, otherwise 65,000 T
  const freeShippingThreshold = 3000000;
  const rawShippingCost = subtotal > freeShippingThreshold ? 0 : 65000;
  const isFreeShipping = rawShippingCost === 0;

  const formattedSubtotal = subtotal.toLocaleString("fa-IR") + " تومان";
  const formattedShipping = isFreeShipping
    ? "رایگان (ارسال هدیه)"
    : rawShippingCost.toLocaleString("fa-IR") + " تومان";
  const formattedTotal = (subtotal + rawShippingCost).toLocaleString("fa-IR") + " تومان";

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer container */}
          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-screen max-w-md bg-background/98 dark:bg-[#0C1210]/98 border-r border-border/40 shadow-2xl flex flex-col h-full backdrop-blur-md"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border/10 flex items-center justify-between text-right">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-full hover:bg-muted/20 text-foreground transition-all cursor-pointer"
                  title="بستن سبد"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="accent" className="text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                    {itemsCount.toLocaleString("fa-IR")} رقم
                  </Badge>
                  <Typography variant="h3" className="text-lg font-bold text-primary dark:text-foreground">
                    سبد خرید ممتاز شالیزار
                  </Typography>
                </div>
              </div>

              {/* Free Shipping Progress Indicator */}
              {subtotal > 0 && (
                <div className="px-6 py-3 bg-primary/5 dark:bg-accent/5 border-b border-border/10 text-right flex flex-col gap-1.5">
                  <span className="text-[11px] text-muted-foreground font-light">
                    {isFreeShipping ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        تبریک! خرید شما مشمول ارسال رایگان لوکس گردید 🎉
                      </span>
                    ) : (
                      <span>
                        خرید تا ارسال رایگان:{" "}
                        <strong className="text-primary dark:text-accent">
                          {(freeShippingThreshold - subtotal).toLocaleString("fa-IR")} تومان
                        </strong>
                      </span>
                    )}
                  </span>
                  <div className="w-full h-1.5 bg-border/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-accent to-primary"
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/10">
                {cart.length === 0 ? (
                  /* Empty State */
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                    <div className="w-20 h-20 rounded-full bg-primary/5 dark:bg-accent/5 flex items-center justify-center mb-6 relative">
                      <ShoppingBag className="w-8 h-8 text-primary dark:text-accent stroke-1.2" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent/20 animate-ping" />
                    </div>
                    <Typography variant="serif-title" className="text-lg font-bold text-foreground mb-2">
                      سبد خرید شما در حال حاضر خالی است
                    </Typography>
                    <Typography variant="body-sm" className="text-muted-foreground max-w-xs mb-8">
                      هیچ برنج ممتاز یا رقم لوکسی به سبد اضافه نشده است. عطر ناب شالیزار منتظر شماست.
                    </Typography>
                    <Button
                      variant="primary"
                      onClick={() => setIsCartOpen(false)}
                      className="px-8 py-3 text-xs font-bold gap-2 rounded-full cursor-pointer hover:scale-102 transition-transform duration-300"
                    >
                      <ArrowRight className="w-4 h-4" />
                      بازگشت و مشاهده محصولات
                    </Button>
                  </div>
                ) : (
                  /* Cart Items */
                  <div className="space-y-4 pt-2">
                    <AnimatePresence initial={false}>
                      {cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0, paddingBottom: 0 }}
                          className="py-4 flex items-center justify-between text-right gap-4 border-b border-border/5"
                        >
                          {/* Remove Action */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 rounded-full hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                            title="حذف از سبد"
                          >
                            <Trash2 className="w-4 h-4 stroke-1.5" />
                          </button>

                          {/* Info Block */}
                          <div className="flex-1 flex flex-col gap-1 pr-1">
                            <span className="text-xs text-accent font-semibold">
                              {item.weight || "۱۰ کیلوگرم"} • کشت ارگانیک
                            </span>
                            <span className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                              {item.name}
                            </span>
                            <span className="text-xs text-primary dark:text-accent font-semibold mt-1">
                              {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                            </span>
                          </div>

                          {/* Visual Logo/Badge Icon */}
                          <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-accent/5 flex items-center justify-center shrink-0 border border-primary/10 relative">
                            <span className="text-primary dark:text-accent font-serif font-extrabold text-xs">
                              {item.imageChar || "برنج"}
                            </span>
                          </div>

                          {/* Elegant Quantity Controls */}
                          <div className="flex flex-col items-center justify-between bg-primary/5 dark:bg-white/5 border border-border/10 rounded-full px-1.5 py-1 min-h-[85px]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded-full hover:bg-primary/10 dark:hover:bg-accent/10 text-foreground/80 hover:text-primary dark:hover:text-accent transition-colors cursor-pointer"
                              title="افزایش تعداد"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-foreground py-1">
                              {item.quantity.toLocaleString("fa-IR")}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded-full hover:bg-primary/10 dark:hover:bg-accent/10 text-foreground/80 hover:text-primary dark:hover:text-accent transition-colors cursor-pointer"
                              title="کاهش تعداد"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Summary and Checkout Button Footer */}
              {cart.length > 0 && (
                <div className="px-6 py-6 border-t border-border/10 bg-primary/2 dark:bg-white/2 space-y-5">
                  <div className="space-y-2.5 text-right text-sm text-foreground/90">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{formattedSubtotal}</span>
                      <span>جمع اقلام سبد خرید</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className={isFreeShipping ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}>
                        {formattedShipping}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-accent" />
                        هزینه ارسال شالیزار
                      </span>
                    </div>
                    <hr className="border-border/10 my-2" />
                    <div className="flex justify-between items-center font-extrabold text-base text-primary dark:text-accent">
                      <span>{formattedTotal}</span>
                      <span>جمع کل سبد خرید</span>
                    </div>
                  </div>

                  {/* Trust indicator */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center bg-background/50 dark:bg-black/20 p-2 rounded-lg border border-border/5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ضمانت اصالت و خلوص ۱۰۰٪ برنج شالیزار طلایی
                  </div>

                  <Button
                    variant="accent"
                    size="lg"
                    onClick={handleCheckoutClick}
                    className="w-full py-4 text-xs font-bold gap-2 rounded-full cursor-pointer hover:scale-102 hover:shadow-lg transition-all duration-300"
                  >
                    <Lock className="w-4 h-4 stroke-1.5" />
                    تکمیل و ثبت نهایی سفارش
                  </Button>

                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary dark:hover:text-accent transition-colors font-light cursor-pointer"
                  >
                    ادامه خرید و مشاهده ارقام بیشتر
                  </button>
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
