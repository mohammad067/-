"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toEnDigits } from "@/lib/shipping";

interface Profile { name: string; phone: string; email: string | null; phoneVerified: boolean }

export function ProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/account/profile", { cache: "no-store" }).then(async (response) => {
      if (response.status === 401) { router.replace("/login"); return; }
      const payload = await response.json() as { data?: Profile };
      setProfile(payload.data ?? null);
    });
  }, [router]);

  if (!profile) return <p>در حال بارگذاری…</p>;

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/account/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profile.name, email: profile.email || null }) });
    setMessage(response.ok ? "پروفایل ذخیره شد." : "ذخیره پروفایل انجام نشد.");
  };

  const requestCode = async () => {
    const response = await fetch("/api/account/phone-verification/request", { method: "POST" });
    setMessage(response.ok ? "کد تأیید ارسال شد." : "ارسال کد انجام نشد.");
  };

  const verify = async () => {
    const response = await fetch("/api/account/phone-verification/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: toEnDigits(code) }) });
    if (response.ok) { setProfile({ ...profile, phoneVerified: true }); setMessage("شماره تأیید شد."); setError(""); }
    else setError("کد تأیید معتبر نیست.");
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold">پروفایل</h1><Button variant="outline" onClick={logout}>خروج</Button></div>
      <form onSubmit={save} className="space-y-4">
        <label className="block text-sm">نام<input className="mt-1 w-full rounded-xl border p-3" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
        <label className="block text-sm">موبایل<input className="mt-1 w-full rounded-xl border bg-gray-50 p-3" value={profile.phone} readOnly /></label>
        <label className="block text-sm">ایمیل<input className="mt-1 w-full rounded-xl border p-3" value={profile.email ?? ""} onChange={(event) => setProfile({ ...profile, email: event.target.value })} /></label>
        <Button type="submit">ذخیره پروفایل</Button>
      </form>
      {!profile.phoneVerified && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-3 text-sm">شماره موبایل هنوز تأیید نشده است.</p>
          <div className="flex flex-wrap gap-2"><Button type="button" onClick={requestCode}>ارسال کد</Button><input className="rounded-xl border p-2" value={code} onChange={(event) => setCode(event.target.value)} inputMode="numeric" placeholder="کد ۶ رقمی" /><Button type="button" variant="outline" onClick={verify}>تأیید</Button></div>
        </div>
      )}
      {message && <p className="text-sm text-green-700">{message}</p>}{error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
