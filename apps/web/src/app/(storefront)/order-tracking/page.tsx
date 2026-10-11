"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Home, Package, Search, Truck } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";

interface TrackedOrder {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totals: { totalRials: number };
  shippingMethod: { code: string; name: string };
  shippingAddress: { recipientName: string; province: string; city: string };
}

function OrderTrackingContent() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState(params.get("orderId")?.toUpperCase() || "");
  const [mobile, setMobile] = useState(params.get("mobile") || "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedMobile = mobile.replace(/\D/g, "");
    if (!orderId.trim() || !/^09\d{9}$/.test(normalizedMobile)) {
      setError("کد سفارش و موبایل ۱۱ رقمی را وارد کنید.");
      setOrder(null);
      setSearched(true);
      return;
    }
    setError("");
    setLoading(true);

    try {
      const query = new URLSearchParams({ orderNumber: orderId.trim(), mobile: normalizedMobile });
      const response = await fetch(`/api/orders?${query.toString()}`, { cache: "no-store" });
      const payload = (await response.json()) as { data?: TrackedOrder; message?: string };
      setOrder(response.ok && payload.data ? payload.data : null);
      setError(response.ok ? "" : (payload.message ?? "پیگیری سفارش انجام نشد."));
    } catch {
      setOrder(null);
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <MainLayout>
      <section className="max-w-4xl mx-auto w-full px-4 md:px-8 py-12 text-right" dir="rtl">
        <div className="mb-10">
          <Typography variant="h2" className="text-2xl md:text-3xl">پیگیری سفارش</Typography>
          <p className="mt-2 text-sm text-muted-foreground">کد سفارش و همان موبایل ثبت‌شده را بنویسید.</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 rounded-3xl border border-[#E5E2DA] bg-white p-4 md:p-6">
          <Input value={orderId} onChange={(event) => setOrderId(event.target.value.toUpperCase())} placeholder="کد سفارش" className="w-full" />
          <Input value={mobile} onChange={(event) => setMobile(event.target.value)} placeholder="موبایل" inputMode="numeric" className="w-full" />
          <Button type="submit" variant="primary" className="gap-2" disabled={loading}><Search className="w-4 h-4" />{loading ? "در حال بررسی…" : "پیگیری"}</Button>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        {order && (
          <article className="mt-8 rounded-3xl border border-[#E5E2DA] bg-white p-5 md:p-8">
            <p className="text-xs text-muted-foreground">کد سفارش</p>
            <p className="font-bold mb-4">{order.orderNumber}</p>
            <p className="text-sm">خریدار: {order.shippingAddress.recipientName}</p>
            <p className="text-sm">مقصد: {order.shippingAddress.province}، {order.shippingAddress.city}</p>
            <p className="text-sm">ارسال: {order.shippingMethod.name}</p>
            <p className="text-sm">وضعیت پرداخت: {order.paymentStatus === "pending" ? "در انتظار پرداخت" : order.paymentStatus}</p>
            <p className="text-sm mb-6">مبلغ: {(order.totals.totalRials / 10).toLocaleString("fa-IR")} تومان</p>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary"><CheckCircle2 className="mx-auto mb-1 w-4 h-4" />ثبت</div>
              <div className="rounded-2xl bg-[#EFE8DC] p-3"><Package className="mx-auto mb-1 w-4 h-4" />آماده‌سازی</div>
              <div className="rounded-2xl bg-[#EFE8DC] p-3"><Truck className="mx-auto mb-1 w-4 h-4" />ارسال</div>
              <div className="rounded-2xl bg-[#EFE8DC] p-3"><Home className="mx-auto mb-1 w-4 h-4" />تحویل</div>
            </div>
          </article>
        )}
        {searched && !order && !error && (
          <p className="mt-8 text-sm text-muted-foreground">سفارشی با این اطلاعات پیدا نشد.</p>
        )}
      </section>
    </MainLayout>
  );
}

export default function OrderTrackingPage() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری…</div>}><OrderTrackingContent /></Suspense>;
}
