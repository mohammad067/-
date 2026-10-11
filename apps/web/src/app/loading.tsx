import React from "react";
import { LoadingState } from "@/components/common/LoadingState";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground animate-fade-in">
      <LoadingState />
    </div>
  );
}
