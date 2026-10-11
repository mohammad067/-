"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-12 animate-fade-in">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2.5 rounded-full flex items-center justify-center"
        title="صفحه قبل"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {Array.from({ length: totalPages }).map((_, idx) => {
        const pageNum = idx + 1;
        const isActive = pageNum === currentPage;
        return (
          <Button
            key={pageNum}
            variant={isActive ? "accent" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold p-0"
          >
            {pageNum.toLocaleString("fa-IR")}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2.5 rounded-full flex items-center justify-center"
        title="صفحه بعد"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
    </div>
  );
};

ProductPagination.displayName = "ProductPagination";
