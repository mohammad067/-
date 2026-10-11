"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, LogOut, UserRound } from "lucide-react";

export function AccountButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/auth", { cache: "no-store", signal: controller.signal })
      .then((response) => setAuthenticated(response.ok))
      .catch(() => setAuthenticated(false));
    return () => controller.abort();
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    router.push("/login");
    router.refresh();
  };

  if (!authenticated) {
    return (
      <Link
        href="/login"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-white/50"
        aria-label="ورود"
      >
        <LogIn className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <details className="group relative">
      <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full hover:bg-white/50" aria-label="منوی حساب کاربری">
        <UserRound className="h-5 w-5" />
      </summary>
      <div className="absolute left-0 top-12 z-50 min-w-40 overflow-hidden rounded-2xl border border-[#E5E2DA] bg-white p-1 text-sm shadow-xl">
        <Link className="block rounded-xl px-4 py-2.5 hover:bg-[#F3EEE4]" href="/account/profile">حساب کاربری</Link>
        <button className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-right text-red-700 hover:bg-red-50" type="button" onClick={() => void logout()}>
          <LogOut className="h-4 w-4" /> خروج از حساب
        </button>
      </div>
    </details>
  );
}
