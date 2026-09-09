"use client";

import React, { useEffect } from "react";
import { useCatalogStore } from "@/features/product-catalog/store";

export const Toast: React.FC = () => {
  const toast = useCatalogStore((s) => s.toast);
  const clearToast = useCatalogStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2500);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-[80] max-w-[min(90vw,20rem)] rounded-2xl bg-[#1E2522] text-white text-sm px-4 py-3 shadow-lg"
    >
      {toast}
    </div>
  );
};
