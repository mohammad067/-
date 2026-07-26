"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { clsx } from "clsx";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link href="/" className={clsx("flex items-center gap-3 select-none cursor-pointer", className)}>
      <div className="relative w-11 h-11 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center border border-primary/20 dark:border-accent/25 transition-all duration-500 hover:scale-105 overflow-hidden">
        <Image
          src="/talaye-shalizar.png"
          alt="طلای شالیزار"
          fill
          className="object-cover rounded-full"
        />
      </div>
      <div className="flex flex-col text-right">
        <Typography variant="h4" className="font-bold text-primary dark:text-accent tracking-wide leading-none transition-colors duration-500 text-sm md:text-base">
          طلای شالیزار
        </Typography>
        <span className="text-[9px] text-muted-foreground tracking-widest font-light mt-1 transition-colors duration-500">
          PREMIUM IRANIAN RICE
        </span>
      </div>
    </Link>
  );
};

Logo.displayName = "Logo";
