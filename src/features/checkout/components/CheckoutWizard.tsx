"use client";

import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/components/ui/Button";
import { estimateShipping, toEnDigits, weightKgFromLabel } from "@/lib/shipping";
import { createOrderId, saveOrder, type StoredOrder } from "@/features/orders/store";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { OrderRoadmap } from "./OrderRoadmap";

const PROVINCES = ["تهران", "گیلان", "مازندران", "اصفهان", "البرز", "فارس"];
const DELIVERY: { id: StoredOrder["deliveryMethod"]; title: string; hint: string }[] = [
  { id: "standard", title: "پست پیشتاز", hint: "۳ تا ۵ روز کاری" },
  { id: "tipax", title: "تیپاکس", hint: "۱ تا ۲ روز کاری" },
  { id: "vip", title: "پیک اختصاصی", hint: "۱ روز کاری" },
];
const DEMO_OTP = "1234";

export const CheckoutWizard: React.FC = () => {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCatalogStore();
  const { name: savedName, phone: savedPhone, verified, login } = useAuthStore();
  const trapRef = useFocusTrap(isCheckoutOpen);
  const [step, setStep] = useState<"auth" | "otp" | "form" | "done">("auth");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [pay, setPay] = useState<"gateway" | "card">("gateway");
  const [delivery, setDelivery] = useState<StoredOrder["deliveryMethod"]>("standard");
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    if (verified && savedPhone) {
      setFullName(savedName);
      setPhone(savedPhone);
      setStep("form");
    } else {
      setStep("auth");
    }
    setError("");
    setOtp("");
    setDoneId("");
  }, [isCheckoutOpen, verified, savedName, savedPhone]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalKg = cart.reduce((acc, item) => acc + weightKgFromLabel(item.weight) * item.quantity, 0);
  const baseShip = useMemo(() => estimateShipping({ province, totalKg }), [province, totalKg]);
  const shipping = delivery === "tipax" ? Math.round(baseShip * 1.2) : delivery === "vip" ? Math.round(baseShip * 1.6) : baseShip;
  const discount = coupon.trim().toUpperCase() === "SHALIZAR10" ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount + shipping;

  const close = () => {
    setIsCheckoutOpen(false);
    setDoneId("");
    setError("");
  };

  const sendOtp = () => {
    const mobile = toEnDigits(phone);
    if (!fullName.trim()) {
      setError("نام را بنویسید.");
      return;
    }
    if (!/^09\d{9}$/.test(mobile)) {
      setError("موبایل را با ۰۹ و ۱۱ رقم بنویسید.");
      return;
    }
    setError("");
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStep("otp");
    }, 700);
  };

  const confirmOtp = () => {
    if (toEnDigits(otp) !== DEMO_OTP) {
      setError("کد نادرست است.");
      return;
    }
    login(fullName.trim(), toEnDigits(phone));
    setError("");
    setStep("form");
  };

  const submit = async () => {
    const mobile = toEnDigits(phone);
    if (!city.trim() || !address.trim()) {
      setError("شهر و آدرس لازم است.");
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
      deliveryMethod: delivery === "weight" ? "standard" : delivery,
      status: "registered",
      createdAt: new Date().toISOString(),
    });
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, fullName, mobile, province, city, address, pay, delivery, items: cart, total }),
      });
    } catch {
      /* local */
    }
    clearCart();
    setDoneId(orderId);
    setStep("done");
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50" dir="rtl">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div ref={trapRef} role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#F8F6F2] text-[#1E2522] rounded-3xl border border-[#E5E2DA] p-6 text-right">
          <button type="button" className="absolute left-4 top-4 min-h-11 min-w-11" onClick={close} aria-label="بستن"><X /></button>

          {step === "auth" && (
            <div className="space-y-3">
              <h2 id="checkout-title" className="text-xl font-bold">ورود برای ثبت سفارش</h2>
              <p className="text-xs text-muted-foreground">فقط نام و شماره. بعد کد پیامک می‌آید.</p>
              <label className="text-xs font-semibold block">نام</label>
              <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <label className="text-xs font-semibold block">موبایل</label>
              <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button variant="primary" className="w-full" type="button" disabled={sending} onClick={sendOtp}>
                {sending ? "در حال ارسال کد…" : "ارسال کد پیامک"}
              </Button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-3">
              <h2 id="checkout-title" className="text-xl font-bold">کد تأیید</h2>
              <p className="text-xs text-muted-foreground">کد به {phone} ارسال شد. فعلاً درگاه پیامک وصل نیست؛ کد آزمایشی ۱۲۳۴ است.</p>
              <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white tracking-[0.4em] text-center" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={4} inputMode="numeric" />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button variant="primary" className="w-full" type="button" onClick={confirmOtp}>تأیید و ادامه خرید</Button>
              <button type="button" className="text-xs text-primary" onClick={() => setStep("auth")}>تغییر شماره</button>
            </div>
          )}

          {step === "form" && (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); submit(); }}>
              <h2 id="checkout-title" className="text-xl font-bold mb-1">آدرس و ارسال</h2>
              <p className="text-xs text-muted-foreground mb-2">{fullName} — {phone}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">استان</label>
                  <select className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={province} onChange={(e) => setProvince(e.target.value)}>
                    {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">شهر</label>
                  <input className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">آدرس</label>
                <textarea rows={2} className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <fieldset className="border-0 p-0">
                <legend className="text-xs font-semibold mb-2">روش ارسال</legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DELIVERY.map((item) => (
                    <button key={item.id} type="button" onClick={() => setDelivery(item.id)} className={`rounded-2xl border px-3 py-2 text-right text-xs ${delivery === item.id ? "border-primary bg-primary/10" : "border-[#E5E2DA] bg-white"}`}>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-muted-foreground mt-0.5">{item.hint}</p>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="border-0 p-0">
                <legend className="text-xs font-semibold mb-2">پرداخت</legend>
                <label className="flex items-center gap-2 bg-white border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm mb-2">
                  <input type="radio" checked={pay === "gateway"} onChange={() => setPay("gateway")} /> درگاه (به‌زودی)
                </label>
                <label className="flex items-center gap-2 bg-white border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm">
                  <input type="radio" checked={pay === "card"} onChange={() => setPay("card")} /> کارت‌به‌کارت
                </label>
              </fieldset>
              <div className="text-xs space-y-1 border-t border-[#E5E2DA] pt-3">
                <p>ارسال: {shipping.toLocaleString("fa-IR")} تومان</p>
                <p className="font-bold text-primary text-sm">جمع: {total.toLocaleString("fa-IR")} تومان</p>
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <Button variant="primary" className="w-full" type="submit" disabled={cart.length === 0}>ثبت نهایی سفارش</Button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-5 py-2">
              <h2 id="checkout-title" className="text-xl font-bold">سفارش ثبت شد</h2>
              <p className="text-sm">شماره سفارش: {doneId}</p>
              <p className="text-xs text-muted-foreground">
                {pay === "gateway" ? "لینک درگاه بعد از تماس می‌آید." : "شماره کارت بعد از تماس ارسال می‌شود."}
              </p>
              <OrderRoadmap active={0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CheckoutWizard.displayName = "CheckoutWizard";
