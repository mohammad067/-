import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";

export const ProductSkeleton: React.FC = () => {
  return (
    <Card variant="glass-premium" className="flex flex-col h-full text-right animate-pulse">
      {/* Visual top */}
      <div className="h-64 bg-primary/5 border-b border-border/20 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-border/40" />
      </div>

      <CardHeader className="p-6 pb-2 flex flex-col gap-2">
        <div className="h-3 w-1/3 bg-border/40 rounded" />
        <div className="h-6 w-3/4 bg-border/50 rounded mt-1" />
      </CardHeader>

      <CardBody className="p-6 py-2 flex flex-col gap-2 flex-grow">
        <div className="h-3 w-full bg-border/30 rounded" />
        <div className="h-3 w-5/6 bg-border/30 rounded" />
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/20">
          <div className="h-3 bg-border/30 rounded" />
          <div className="h-3 bg-border/30 rounded" />
        </div>
      </CardBody>

      <CardFooter className="p-6 pt-4 flex items-center justify-between border-t border-border/20">
        <div className="flex flex-col gap-1.5 w-1/3">
          <div className="h-3 w-1/2 bg-border/30 rounded" />
          <div className="h-5 w-full bg-border/50 rounded" />
        </div>
        <div className="h-10 w-24 bg-border/50 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  );
};
