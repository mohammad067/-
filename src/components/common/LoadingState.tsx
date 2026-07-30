import React from "react";
import { Typography } from "@/components/ui/Typography";

export const LoadingState: React.FC<{ message?: string }> = ({ message = "در حال بارگذاری شالیزار هنر..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center animate-fade-in">
      <div className="relative flex items-center justify-center mb-6">
        {/* Pulsing luxurious golden circles representing rice grain elements */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-accent/20 animate-ping duration-1000" />
        <div className="relative w-16 h-16 rounded-full border-2 border-t-accent border-r-accent border-b-transparent border-l-transparent animate-spin duration-1000" />
        <div className="absolute w-12 h-12 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/talaye-shalizar.png"
            alt="طلای شالیزار بارگذاری"
            className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(200,167,93,0.3)]"
          />
        </div>
      </div>
      <Typography variant="body-sm" className="text-muted-foreground font-light tracking-wide animate-pulse mt-4">
        {message}
      </Typography>
    </div>
  );
};

LoadingState.displayName = "LoadingState";
