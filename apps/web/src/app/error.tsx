"use client";

import React, { useEffect } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { MainLayout } from "@/components/layout/MainLayout";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Next.js intercepted route rendering error:", error);
  }, [error]);

  return (
    <MainLayout>
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <ErrorState onRetry={reset} />
        </div>
      </div>
    </MainLayout>
  );
}
