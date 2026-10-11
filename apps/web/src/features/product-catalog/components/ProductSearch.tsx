"use client";

import React, { useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  autoFocus?: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ searchQuery, setSearchQuery, autoFocus = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        id="product-search"
        type="text"
        placeholder="جستجوی رقم، شهر یا قهوه‌ای..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-5 pr-12 py-3 rounded-full border border-[#E5E2DA] bg-white text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary text-right"
      />
      <Search className="absolute top-1/2 right-4 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    </div>
  );
};

ProductSearch.displayName = "ProductSearch";
