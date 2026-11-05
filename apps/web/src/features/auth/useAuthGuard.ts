"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCatalogStore } from "@/features/product-catalog/store";

export function useAuthGuard() {
  const router = useRouter();
  const clearWishlist = useCatalogStore((state) => state.clearWishlist);
  const showToast = useCatalogStore((state) => state.showToast);

  return useCallback(async (returnTo: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth", { cache: "no-store" });

      if (response.ok) return true;

      if (response.status === 401) {
        clearWishlist();
        showToast("برای استفاده از علاقه‌مندی‌ها ابتدا وارد حساب شوید.");
        router.push(`/login?next=${encodeURIComponent(returnTo)}`);
        return false;
      }

      showToast("بررسی وضعیت حساب ممکن نیست؛ دوباره تلاش کنید.");
      return false;
    } catch {
      showToast("ارتباط با سرویس ورود برقرار نشد.");
      return false;
    }
  }, [clearWishlist, router, showToast]);
}
