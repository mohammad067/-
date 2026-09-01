"use client";

import React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchButtonProps {
  onClick?: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  const router = useRouter();
  return (
    <button
      onClick={onClick ?? (() => router.push("/products?focus=search"))}
      className="p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title="جستجو در شالیزار"
      aria-label="جستجو در محصولات"
    >
      <Search className="w-5 h-5 stroke-1.5" />
    </button>
  );
};

SearchButton.displayName = "SearchButton";
