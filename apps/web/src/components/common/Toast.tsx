"use client";

import React, { useEffect } from "react";
import { useCatalogStore } from "@/features/product-catalog/store";

export const Toast: React.FC = () => {
  const toast = useCatalogStore((s) => s.toast);
  const clearToast = useCatalogStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2800);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-[#1E2522] text-white text-sm px-5 py-3 shadow-lg"
    >
      {toast}
    </div>
  );
};
