"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { toEnDigits } from "@/lib/shipping";
import { saveOrder, type StoredOrder } from "@/features/orders/store";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { OrderRoadmap } from "./OrderRoadmap";

const PROVINCES = ["تهران", "گیلان", "مازندران", "اصفهان", "البرز", "فارس"];
const DELIVERY: { id: StoredOrder["deliveryMethod"]; title: string; hint: string; price: number }[] = [
  { id: "standard", title: "پست پیشتاز", hint: "۳ تا ۵ روز کاری", price: 50_000 },
  { id: "tipax", title: "تیپاکس", hint: "۱ تا ۲ روز کاری", price: 70_000 },
  { id: "vip", title: "پیک اختصاصی", hint: "۱ روز کاری", price: 120_000 },
];

interface CheckoutResponse {
  data?: {
    id: string;
    orderNumber: string;
    totals: {
      subtotalRials: number;
      shippingRials: number;
      totalRials: number;
    };
  };
  message?: string;
}

interface Account {
  id: string;
  name: string;
  phone: string;
  email: string | null;
}

interface SavedAddress {
  id: string;
  label: string | null;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string | null;
  addressLine: string;
  isDefault: boolean;
}

export const CheckoutWizard: React.FC = () => {
  const { cart, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCatalogStore();
  const trapRef = useFocusTrap(isCheckoutOpen);
  const [step, setStep] = useState<"auth" | "form" | "done">("auth");
  const [account, setAccount] = useState<Account | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [delivery, setDelivery] = useState<StoredOrder["deliveryMethod"]>("standard");
  const [error, setError] = useState("");
  const [doneId, setDoneId] = useState("");
  const [sending, setSending] = useState(false);
  const [checkoutKey, setCheckoutKey] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedAddressId, setSavedAddressId] = useState("");

  const applySavedAddress = useCallback((savedAddress: SavedAddress) => {
    setSavedAddressId(savedAddress.id);
    setFullName(savedAddress.recipientName);
    setPhone(savedAddress.phone);
    setProvince(savedAddress.province);
    setCity(savedAddress.city);
    setAddress(savedAddress.addressLine);
    setPostalCode(savedAddress.postalCode ?? "");
  }, []);

  const loadSavedAddresses = useCallback(async () => {
    const response = await fetch("/api/account/addresses", { cache: "no-store" });
    if (!response.ok) return;

    const payload = await response.json() as { data?: SavedAddress[] };
    const addresses = payload.data ?? [];
    setSavedAddresses(addresses);
    const preferred = addresses.find((item) => item.isDefault) ?? addresses[0];
    if (preferred) applySavedAddress(preferred);
  }, [applySavedAddress]);

  useEffect(() => {
    if (!isCheckoutOpen) return;

    const controller = new AbortController();
    void fetch("/api/auth", { cache: "no-store", signal: controller.signal })
      .then(async (response) => ({ response, payload: await response.json() as { data?: Account } }))
      .then(({ response, payload }) => {
        if (!response.ok || !payload.data) {
          setAccount(null);
          setStep("auth");
          return;
        }

        setAccount(payload.data);
        setFullName(payload.data.name);
        setPhone(payload.data.phone);
        setStep("form");
        void loadSavedAddresses();
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [isCheckoutOpen, loadSavedAddresses]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = DELIVERY.find((item) => item.id === delivery)?.price ?? 50_000;
  const total = subtotal + shipping;

  const close = () => {
    setIsCheckoutOpen(false);
    setStep(account ? "form" : "auth");
    setDoneId("");
    setError("");
  };

  const submitAuth = async () => {
    const mobile = toEnDigits(phone).replace(/\D/g, "");

    if (!/^09\d{9}$/.test(mobile) || password.length < 8) {
      setError("موبایل معتبر و رمز عبور حداقل ۸ کاراکتری وارد کنید.");
      return;
    }
    if (authMode === "register" && (!fullName.trim() || password !== passwordConfirmation)) {
      setError("نام را وارد کنید و تکرار رمز عبور باید یکسان باشد.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: authMode, name: fullName.trim(), phone: mobile, password, passwordConfirmation }),
      });
      const payload = await response.json() as { data?: Account; message?: string };

      if (!response.ok || !payload.data) {
        setError(payload.message ?? "ورود انجام نشد.");
        return;
      }

      setAccount(payload.data);
      setFullName(payload.data.name);
      setPhone(payload.data.phone);
      setPassword("");
      setPasswordConfirmation("");
      setStep("form");
      await loadSavedAddresses();
    } catch {
      setError("ارتباط با سرویس ورود برقرار نشد.");
    } finally {
      setSending(false);
    }
  };

  const submit = async () => {
    if (!account) {
      setStep("auth");
      setError("برای ثبت سفارش ابتدا وارد حساب شوید.");
      return;
    }

    const mobile = toEnDigits(phone).replace(/\D/g, "");
    const normalizedPostalCode = toEnDigits(postalCode).replace(/\D/g, "");

    if (!fullName.trim()) {
      setError("نام تحویل‌گیرنده را بنویسید.");
      return;
    }
    if (!/^09\d{9}$/.test(mobile)) {
      setError("موبایل را با ۰۹ و ۱۱ رقم بنویسید.");
      return;
    }
    if (!city.trim() || !address.trim()) {
      setError("شهر و آدرس لازم است.");
      return;
    }
    if (normalizedPostalCode && !/^\d{10}$/.test(normalizedPostalCode)) {
      setError("کد پستی باید ۱۰ رقم باشد.");
      return;
    }
    if (cart.length === 0) {
      setError("سبد خرید خالی است.");
      return;
    }

    const idempotencyKey = checkoutKey || crypto.randomUUID();
    setCheckoutKey(idempotencyKey);
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutKey: idempotencyKey,
          fullName: fullName.trim(),
          mobile,
          province,
          city: city.trim(),
          address: address.trim(),
          postalCode: normalizedPostalCode,
          delivery,
          items: cart.map(({ variantId, quantity }) => ({ variantId, quantity })),
        }),
      });
      const payload = (await response.json()) as CheckoutResponse;

      if (!response.ok || !payload.data) {
        setError(payload.message ?? "ثبت سفارش انجام نشد. دوباره تلاش کنید.");
        return;
      }

      const serverSubtotal = payload.data.totals.subtotalRials / 10;
      const serverShipping = payload.data.totals.shippingRials / 10;
      const serverTotal = payload.data.totals.totalRials / 10;
      saveOrder({
        orderId: payload.data.orderNumber,
        mobile,
        customerName: fullName.trim(),
        items: cart,
        subtotal: serverSubtotal,
        shippingCost: serverShipping,
        total: serverTotal,
        province,
        city: city.trim(),
        address: address.trim(),
        postalCode: normalizedPostalCode,
        deliveryMethod: delivery,
        status: "registered",
        createdAt: new Date().toISOString(),
      });
      clearCart();
      setDoneId(payload.data.orderNumber);
      setCheckoutKey("");
      setStep("done");
    } catch {
      setError("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setSending(false);
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <div className="fixed inset-0 z-50" dir="rtl">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div ref={trapRef} role="dialog" aria-modal="true" aria-labelledby="checkout-title" className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#F8F6F2] text-[#1E2522] rounded-3xl border border-[#E5E2DA] p-6 text-right">
          <button type="button" className="absolute left-4 top-4 min-h-11 min-w-11" onClick={close} aria-label="بستن"><X /></button>

          {step === "auth" && (
            <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void submitAuth(); }}>
              <h2 id="checkout-title" className="text-xl font-bold">{authMode === "login" ? "ورود برای ادامه خرید" : "ساخت حساب کاربری"}</h2>
              <p className="text-xs text-muted-foreground">ثبت سفارش فقط برای کاربران واردشده امکان‌پذیر است.</p>
              <div className="grid grid-cols-2 rounded-xl border border-[#E5E2DA] bg-white p-1">
                <button type="button" className={`rounded-lg py-2 text-sm ${authMode === "login" ? "bg-primary text-white" : ""}`} onClick={() => { setAuthMode("login"); setError(""); }}>ورود</button>
                <button type="button" className={`rounded-lg py-2 text-sm ${authMode === "register" ? "bg-primary text-white" : ""}`} onClick={() => { setAuthMode("register"); setError(""); }}>ثبت‌نام</button>
              </div>
              {authMode === "register" && (
                <div>
                  <label className="text-xs font-semibold block mb-1">نام و نام خانوادگی</label>
                  <input autoComplete="name" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={fullName} onChange={(event) => setFullName(event.target.value)} />
                </div>
              )}
              <div>
                <label className="text-xs font-semibold block mb-1">شماره موبایل</label>
                <input autoComplete="tel" inputMode="tel" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="۰۹۱۲۱۲۳۴۵۶۷" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">رمز عبور</label>
                <input type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              {authMode === "register" && (
                <div>
                  <label className="text-xs font-semibold block mb-1">تکرار رمز عبور</label>
                  <input type="password" autoComplete="new-password" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
                </div>
              )}
              {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
              <Button variant="primary" className="w-full" type="submit" disabled={sending}>
                {sending ? "در حال بررسی…" : authMode === "login" ? "ورود و ادامه" : "ثبت‌نام و ادامه"}
              </Button>
            </form>
          )}

          {step === "form" && (
            <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void submit(); }}>
              <h2 id="checkout-title" className="text-xl font-bold mb-1">تکمیل سفارش</h2>
              <p className="text-xs text-muted-foreground mb-3">واردشده با حساب <strong>{account?.name}</strong> — {account?.phone}</p>
              {savedAddresses.length > 0 && (
                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="text-xs font-semibold" htmlFor="checkout-saved-address">آدرس ذخیره‌شده</label>
                    <Link className="text-xs text-primary hover:underline" href="/account/addresses" onClick={close}>مدیریت آدرس‌ها</Link>
                  </div>
                  <select
                    id="checkout-saved-address"
                    className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white"
                    value={savedAddressId}
                    onChange={(event) => {
                      const savedAddress = savedAddresses.find((item) => item.id === event.target.value);
                      if (savedAddress) applySavedAddress(savedAddress);
                    }}
                  >
                    {savedAddresses.map((item) => (
                      <option key={item.id} value={item.id}>{item.label || `${item.province}، ${item.city}`}{item.isDefault ? " (پیش‌فرض)" : ""}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold block mb-1">استان</label>
                  <select className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={province} onChange={(event) => setProvince(event.target.value)}>
                    {PROVINCES.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">شهر</label>
                  <input autoComplete="address-level2" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={city} onChange={(event) => setCity(event.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">آدرس</label>
                <textarea autoComplete="street-address" rows={2} className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={address} onChange={(event) => setAddress(event.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">کد پستی (اختیاری)</label>
                <input autoComplete="postal-code" inputMode="numeric" className="w-full border border-[#E5E2DA] rounded-xl px-3 py-2 text-sm bg-white" value={postalCode} onChange={(event) => setPostalCode(event.target.value)} />
              </div>
              <fieldset className="border-0 p-0">
                <legend className="text-xs font-semibold mb-2">روش ارسال</legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {DELIVERY.map((item) => (
                    <button key={item.id} type="button" onClick={() => setDelivery(item.id)} className={`rounded-2xl border px-3 py-2 text-right text-xs ${delivery === item.id ? "border-primary bg-primary/10" : "border-[#E5E2DA] bg-white"}`}>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-muted-foreground mt-0.5">{item.hint}</p>
                      <p className="mt-1">{item.price.toLocaleString("fa-IR")} تومان</p>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="text-xs space-y-1 border-t border-[#E5E2DA] pt-3">
                <p>ارسال: {shipping.toLocaleString("fa-IR")} تومان</p>
                <p className="font-bold text-primary text-sm">جمع: {total.toLocaleString("fa-IR")} تومان</p>
                <p className="text-[11px] text-muted-foreground">قیمت و موجودی هنگام ثبت، دوباره در سرور بررسی می‌شود.</p>
              </div>
              {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
              <Button variant="primary" className="w-full" type="submit" disabled={sending || cart.length === 0}>
                {sending ? "در حال ثبت سفارش…" : "ثبت نهایی سفارش"}
              </Button>
            </form>
          )}

          {step === "done" && (
            <div className="space-y-5 py-2">
              <h2 id="checkout-title" className="text-xl font-bold">سفارش با موفقیت ثبت شد</h2>
              <p className="text-sm">شماره سفارش: <strong dir="ltr">{doneId}</strong></p>
              <p className="text-xs text-muted-foreground">سفارش به حساب کاربری شما متصل شد و از بخش پیگیری قابل مشاهده است.</p>
              <OrderRoadmap active={0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CheckoutWizard.displayName = "CheckoutWizard";
