"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { estimateShipping, toEnDigits, weightKgFromLabel } from "@/lib/shipping";
import { createOrderId, saveOrder } from "@/features/orders/store";

const PROVINCES = ["تهران", "گیلان", "مازندران", "اصفهان", "البرز", "فارس"];

export const CheckoutWizard: React.FC = () => {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCatalogStore();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [pay, setPay] = useState<"cod" | "card">("cod");
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalKg = cart.reduce((acc, item) => acc + weightKgFromLabel(item.weight) * item.quantity, 0);
  const shipping = useMemo(() => estimateShipping({ province, totalKg }), [province, totalKg]);
  const discount = coupon.trim().toUpperCase() === "SHALIZAR10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount + shipping;

  const submit = async () => {
    const mobile = toEnDigits(phone);
    if (!fullName.trim() || !city.trim() || !address.trim()) {
      setError("نام، شهر و آدرس لازم است.");
      return;
    }
    if (!/^09\d{9}$/.test(mobile)) {
      setError("موبایل را به شکل 09۱۲۳۴۵۶۷۸۹۰ بنویسید.");
      return;
    }
    const orderId = createOrderId();
    const payload = {
      orderId,
      fullName,
      mobile,
      province,
      city,
      address,
      pay,
      coupon: discount ? "SHALIZAR10" : "",
      items: cart,
      totalKg,
      subtotal,
      discount,
      shipping,
      total,
    };
    saveOrder({
      orderId,
      mobile,
      customerName: fullName,
      items: cart,
      subtotal,
      shippingCost: shipping,
      total,
      province,
      city,
      address,
      postalCode: "",
      deliveryMethod: "weight",
      status: "registered",
      createdAt: new Date().toISOString(),
    });
    try {
      await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } catch {
      /* offline fallback: local order store */
    }
    clearCart();
    setDoneId(orderId);
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        <motion.div className="absolute inset-0 bg-black/40" onClick={() => setIsCheckoutOpen(false)} />
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div className="relative w-full max-w-xl bg-[#F8F6F2] text-[#1E2522] rounded-3xl border border-[#E5E2DA] p-6 text-right">
            <button className="absolute left-4 top-4" onClick={() => { setIsCheckoutOpen(false); setDoneId(""); }} aria-label="بستن"><X /></button>
            {doneId ? (
              <div className="space-y-3 py-6">
                <h2 className="text-xl font-bold">سفارش ثبت شد</h2>
                <p className="text-sm">شماره سفارش: {doneId}</p>
                <p className="text-xs text-muted-foreground">
                  {pay === "cod" ? "پرداخت در محل زمان تحویل." : "کارت‌به‌کارت: شماره کارت بعد از تماس ارسال می‌شود. درگاه آنلاین هنوز وصل نیست."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-xl font-bold mb-2">تسویه</h2>
                <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" placeholder="نام گیرنده" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" placeholder="موبایل 09xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <select className="border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={province} onChange={(e) => setProvince(e.target.value)}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <input className="border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" placeholder="شهر" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <textarea className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" rows={2} placeholder="آدرس" value={address} onChange={(e) => setAddress(e.target.value)} />
                <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" placeholder="کد تخفیف: SHALIZAR10" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <div className="flex gap-3 text-sm">
                  <label className="flex items-center gap-1"><input type="radio" checked={pay === "cod"} onChange={() => setPay("cod")} /> پرداخت در محل</label>
                  <label className="flex items-center gap-1"><input type="radio" checked={pay === "card"} onChange={() => setPay("card")} /> کارت‌به‌کارت</label>
                </div>
                <div className="text-xs space-y-1 border-t border-[#E5E2DA] pt-3">
                  <p>وزن محموله: {totalKg.toLocaleString("fa-IR")} کیلو</p>
                  <p>پست: {shipping.toLocaleString("fa-IR")} تومان</p>
                  {discount > 0 && <p>تخفیف: {discount.toLocaleString("fa-IR")} تومان</p>}
                  <p className="font-bold text-primary text-sm">جمع: {total.toLocaleString("fa-IR")} تومان</p>
                </div>
                {error && <p className="text-xs text-red-600">{error}</p>}
                <Button variant="primary" className="w-full" onClick={submit} disabled={cart.length === 0}>ثبت سفارش</Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

CheckoutWizard.displayName = "CheckoutWizard";
