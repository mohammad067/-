"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ProductSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full md:w-80">
      <Input
        id="catalog-search-input"
        type="text"
        placeholder="جستجوی رقم (هاشمی، صدری، مازندران...)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pr-12 pl-4 py-3 rounded-full text-xs text-right border-border/60 bg-background/50 backdrop-blur-md"
      />
      <div className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground">
        <Search className="w-4 h-4" />
      </div>
    </div>
  );
};

ProductSearch.displayName = "ProductSearch";
