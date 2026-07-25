"use client";

import React from "react";
import { Search } from "lucide-react";

interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="جستجوی نام رقم برنج یا شهر..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-5 pr-12 py-3 rounded-full border border-border bg-white/20 dark:bg-black/5 text-foreground text-xs font-light transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-right"
      />
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
        <Search className="w-4 h-4 stroke-1.5" />
      </div>
    </div>
  );
};

ProductSearch.displayName = "ProductSearch";
