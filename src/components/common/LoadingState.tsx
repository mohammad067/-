import React from "react";
import { Typography } from "@/components/ui/Typography";

export const LoadingState: React.FC<{ message?: string }> = ({ message = "در حال بارگذاری شالیزار هنر..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center animate-fade-in">
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulsing luxurious golden circles representing rice grain elements */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-accent/20 animate-ping duration-1000" />
        <div className="relative w-12 h-12 rounded-full border-t-2 border-r-2 border-accent animate-spin duration-700" />
        <div className="absolute w-3 h-3 rounded-full bg-primary" />
      </div>
      <Typography variant="body-sm" className="text-muted-foreground font-light tracking-wide animate-pulse">
        {message}
      </Typography>
    </div>
  );
};

LoadingState.displayName = "LoadingState";
