"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toEnDigits } from "@/lib/shipping";

interface Address {
  id: string; label: string | null; recipientName: string; phone: string; province: string;
  city: string; postalCode: string | null; addressLine: string; isDefault: boolean;
}

const emptyForm = { label: "", recipientName: "", phone: "", province: "", city: "", postalCode: "", addressLine: "", isDefault: false };

export function AddressManager() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/account/addresses", { cache: "no-store" });
    if (response.status === 401) { router.replace("/login"); return; }
    const payload = await response.json() as { data?: Address[] };
    setAddresses(payload.data ?? []);
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/account/addresses${editingId ? `/${editingId}` : ""}`, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        phone: toEnDigits(form.phone).replace(/\D/g, ""),
        postalCode: form.postalCode ? toEnDigits(form.postalCode).replace(/\D/g, "") : null,
      }),
    });
    setMessage(response.ok ? "آدرس ذخیره شد." : "ذخیره آدرس انجام نشد.");
    if (response.ok) { setForm(emptyForm); setEditingId(null); await load(); }
  };

  const edit = (address: Address) => {
    setEditingId(address.id);
    setForm({ label: address.label ?? "", recipientName: address.recipientName, phone: address.phone, province: address.province, city: address.city, postalCode: address.postalCode ?? "", addressLine: address.addressLine, isDefault: address.isDefault });
  };

  const remove = async (id: string) => {
    if (!window.confirm("این آدرس حذف شود؟")) return;
    const response = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    if (response.ok) await load();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">مدیریت آدرس‌ها</h1>
      <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
        <input className="rounded-xl border p-3" placeholder="عنوان آدرس؛ خانه یا محل کار" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <input className="rounded-xl border p-3" placeholder="نام تحویل‌گیرنده" required value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} />
        <input className="rounded-xl border p-3" placeholder="موبایل" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="rounded-xl border p-3" placeholder="استان" required value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} />
        <input className="rounded-xl border p-3" placeholder="شهر" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input className="rounded-xl border p-3" placeholder="کد پستی" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <textarea className="rounded-xl border p-3 md:col-span-2" placeholder="نشانی کامل" required value={form.addressLine} onChange={(e) => setForm({ ...form, addressLine: e.target.value })} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />آدرس پیش‌فرض</label>
        <div className="flex gap-2"><Button type="submit">{editingId ? "ویرایش آدرس" : "افزودن آدرس"}</Button>{editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>انصراف</Button>}</div>
      </form>
      {message && <p className="text-sm text-green-700">{message}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {addresses.map((address) => (
          <article key={address.id} className="rounded-2xl border p-4">
            <div className="flex justify-between"><strong>{address.label || "آدرس"}</strong>{address.isDefault && <span className="text-xs text-primary">پیش‌فرض</span>}</div>
            <p className="mt-2 text-sm">{address.recipientName} — {address.phone}</p><p className="text-sm text-muted-foreground">{address.province}، {address.city}، {address.addressLine}</p>
            <div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => edit(address)}>ویرایش</Button><Button size="sm" variant="ghost" onClick={() => void remove(address.id)}>حذف</Button></div>
          </article>
        ))}
      </div>
    </div>
  );
}
