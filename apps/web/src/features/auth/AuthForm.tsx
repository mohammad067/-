"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { toEnDigits } from "@/lib/shipping";

export function AuthForm({ initialMode }: { initialMode: "login" | "register" }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "reset">(initialMode);
  const [resetStep, setResetStep] = useState<"request" | "confirm">("request");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const mobile = toEnDigits(phone).replace(/\D/g, "");
    const requestMode = mode === "reset"
      ? resetStep === "request" ? "password-request" : "password-confirm"
      : mode;

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: requestMode,
          name,
          phone: mobile,
          password,
          passwordConfirmation: confirmation,
          password_confirmation: confirmation,
          code: toEnDigits(code),
        }),
      });
      const payload = await response.json() as { data?: unknown; message?: string };

      if (!response.ok) {
        setError(payload.message ?? "درخواست انجام نشد.");
        return;
      }

      if (mode === "reset") {
        if (resetStep === "request") {
          setResetStep("confirm");
          setMessage("کد بازیابی ارسال شد.");
        } else {
          setMode("login");
          setResetStep("request");
          setMessage("رمز تغییر کرد؛ اکنون وارد شوید.");
        }
        return;
      }

      router.push("/account/profile");
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-[#E5E2DA] bg-white p-6 text-right" dir="rtl">
      <h1 className="text-2xl font-bold">{mode === "login" ? "ورود به حساب" : mode === "register" ? "ساخت حساب" : "بازیابی رمز عبور"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">برای ثبت و پیگیری سفارش وارد حساب شوید.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "register" && (
          <label className="block text-sm">نام و نام خانوادگی<input className="mt-1 w-full rounded-xl border p-3" value={name} onChange={(event) => setName(event.target.value)} required /></label>
        )}
        <label className="block text-sm">شماره موبایل<input className="mt-1 w-full rounded-xl border p-3" inputMode="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
        {mode === "reset" && resetStep === "confirm" && (
          <label className="block text-sm">کد پیامک<input className="mt-1 w-full rounded-xl border p-3" inputMode="numeric" value={code} onChange={(event) => setCode(event.target.value)} required /></label>
        )}
        {(mode !== "reset" || resetStep === "confirm") && (
          <label className="block text-sm">رمز عبور<input type="password" className="mt-1 w-full rounded-xl border p-3" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
        )}
        {(mode === "register" || (mode === "reset" && resetStep === "confirm")) && (
          <label className="block text-sm">تکرار رمز عبور<input type="password" className="mt-1 w-full rounded-xl border p-3" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required minLength={8} /></label>
        )}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "در حال بررسی…" : "ادامه"}</Button>
      </form>
      <div className="mt-5 flex flex-wrap gap-3 text-xs text-primary">
        {mode !== "login" && <Link href="/login">ورود</Link>}
        {mode !== "register" && <Link href="/register">ثبت‌نام</Link>}
        {mode !== "reset" && <button type="button" onClick={() => setMode("reset")}>فراموشی رمز عبور</button>}
      </div>
    </div>
  );
}
