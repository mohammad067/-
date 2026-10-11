"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totals: { totalRials: number };
  placedAt: string;
  items: Array<{ productName: string; variantName: string; quantity: number }>;
}

const statusLabels: Record<string, string> = {
  pending_payment: "در انتظار پرداخت", paid: "پرداخت‌شده", processing: "در حال آماده‌سازی",
  shipped: "ارسال‌شده", delivered: "تحویل‌شده", cancelled: "لغوشده", expired: "منقضی‌شده", refunded: "بازپرداخت‌شده",
};

export function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    void fetch("/api/account/orders", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) { router.replace("/login"); return; }
      const payload = await response.json() as { data?: Order[] };
      setOrders(payload.data ?? []);
    });
  }, [router]);

  if (orders === null) return <p>در حال بارگذاری سفارش‌ها…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">تاریخچه سفارش‌ها</h1>
      {orders.length === 0 ? <p className="text-sm text-muted-foreground">هنوز سفارشی ثبت نشده است.</p> : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><strong dir="ltr">{order.orderNumber}</strong><span className="rounded-full bg-[#F3EEE4] px-3 py-1 text-xs">{statusLabels[order.status] ?? order.status}</span></div>
              <p className="mt-2 text-sm text-muted-foreground">{order.items.map((item) => `${item.productName} (${item.quantity.toLocaleString("fa-IR")})`).join("، ")}</p>
              <p className="mt-2 font-bold text-primary">{(order.totals.totalRials / 10).toLocaleString("fa-IR")} تومان</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
