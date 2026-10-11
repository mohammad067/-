import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";

export const ProductSkeleton: React.FC = () => {
  return (
    <Card variant="glass-premium" className="flex flex-col h-full text-right animate-pulse border border-border/10 overflow-hidden">
      {/* Visual top */}
      <div className="h-64 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/10 flex items-center justify-center relative">
        <div className="w-24 h-24 rounded-full bg-border/20 border border-white/20" />
        <div className="absolute top-4 right-4 w-12 h-6 bg-border/20 rounded-full" />
        <div className="absolute top-4 left-4 w-16 h-6 bg-border/20 rounded-full" />
      </div>

      <CardHeader className="p-6 pb-2 flex flex-col gap-2">
        <div className="h-3.5 w-1/3 bg-border/30 rounded" />
        <div className="h-6 w-3/4 bg-border/40 rounded mt-1" />
      </CardHeader>

      <CardBody className="p-6 py-2 flex flex-col gap-2 flex-grow">
        <div className="h-3 w-full bg-border/25 rounded" />
        <div className="h-3 w-5/6 bg-border/25 rounded" />
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/10">
          <div className="h-3 w-3/4 bg-border/20 rounded" />
          <div className="h-3 w-2/3 bg-border/20 rounded" />
        </div>
      </CardBody>

      <CardFooter className="p-6 pt-4 flex items-center justify-between border-t border-border/10 bg-primary/2">
        <div className="flex flex-col gap-1.5 w-1/3 text-right">
          <div className="h-3 w-1/2 bg-border/20 rounded" />
          <div className="h-5 w-full bg-border/35 rounded mt-1" />
        </div>
        <div className="h-10 w-24 bg-border/45 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  );
};
