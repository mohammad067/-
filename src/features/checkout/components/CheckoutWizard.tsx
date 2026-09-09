"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { estimateShipping, toEnDigits, weightKgFromLabel } from "@/lib/shipping";
import { createOrderId, saveOrder } from "@/features/orders/store";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const PROVINCES = ["تهران", "گیلان", "مازندران", "اصفهان", "البرز", "فارس"];

export const CheckoutWizard: React.FC = () => {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCatalogStore();
  const trapRef = useFocusTrap(isCheckoutOpen);
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

  const close = () => {
    setIsCheckoutOpen(false);
    setDoneId("");
    setError("");
  };

  const submit = async () => {
    const mobile = toEnDigits(phone);
    if (!fullName.trim() || !city.trim() || !address.trim()) {
      setError("نام، شهر و آدرس لازم است.");
      return;
    }
    if (!/^09\d{9}$/.test(mobile)) {
      setError("موبایل را با ۰۹ و ۱۱ رقم بنویسید.");
      return;
    }
    const orderId = createOrderId();
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
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, fullName, mobile, province, city, address, pay, items: cart, total }),
      });
    } catch {
      /* local fallback */
    }
    clearCart();
    setDoneId(orderId);
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
          className="relative w-full max-w-xl bg-[#F8F6F2] text-[#1E2522] rounded-3xl border border-[#E5E2DA] p-6 text-right"
        >
          <button type="button" className="absolute left-4 top-4 min-h-11 min-w-11" onClick={close} aria-label="بستن تسویه">
            <X />
          </button>
          {doneId ? (
            <div className="space-y-3 py-6">
              <h2 id="checkout-title" className="text-xl font-bold">سفارش ثبت شد</h2>
              <p className="text-sm">شماره سفارش: {doneId}</p>
              <p role="status" className="text-xs text-muted-foreground">
                {pay === "cod" ? "پرداخت در محل زمان تحویل." : "کارت‌به‌کارت بعد از تماس."}
              </p>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <h2 id="checkout-title" className="text-xl font-bold mb-2">تسویه</h2>
              <div>
                <label htmlFor="co-name" className="text-xs font-semibold block mb-1">نام گیرنده</label>
                <input id="co-name" autoComplete="name" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="co-phone" className="text-xs font-semibold block mb-1">موبایل</label>
                <input id="co-phone" inputMode="tel" autoComplete="tel" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="co-province" className="text-xs font-semibold block mb-1">استان</label>
                  <select id="co-province" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={province} onChange={(e) => setProvince(e.target.value)}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="co-city" className="text-xs font-semibold block mb-1">شهر</label>
                  <input id="co-city" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="co-address" className="text-xs font-semibold block mb-1">آدرس</label>
                <textarea id="co-address" rows={2} className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <label htmlFor="co-coupon" className="text-xs font-semibold block mb-1">کد تخفیف (اختیاری)</label>
                <input id="co-coupon" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              </div>
              <fieldset className="border-0 p-0">
                <legend className="text-xs font-semibold mb-1">روش پرداخت</legend>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-1"><input type="radio" name="pay" checked={pay === "cod"} onChange={() => setPay("cod")} /> پرداخت در محل</label>
                  <label className="flex items-center gap-1"><input type="radio" name="pay" checked={pay === "card"} onChange={() => setPay("card")} /> کارت‌به‌کارت</label>
                </div>
              </fieldset>
              <div className="text-xs space-y-1 border-t border-[#E5E2DA] pt-3" aria-live="polite">
                <p>وزن محموله: {totalKg.toLocaleString("fa-IR")} کیلو</p>
                <p>پست: {shipping.toLocaleString("fa-IR")} تومان</p>
                {discount > 0 && <p>تخفیف: {discount.toLocaleString("fa-IR")} تومان</p>}
                <p className="font-bold text-primary text-sm">جمع: {total.toLocaleString("fa-IR")} تومان</p>
              </div>
              {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
              <Button variant="primary" className="w-full" type="submit" disabled={cart.length === 0}>ثبت سفارش</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

CheckoutWizard.displayName = "CheckoutWizard";
