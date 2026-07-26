"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <Link
      href="/"
      className={clsx(
        "flex items-center gap-3 select-none cursor-pointer",
        className
      )}
    >
      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-primary/20 dark:border-accent/25 transition-all duration-500 hover:scale-105">
        <Image
          src="/talaye-shalizar.png"
          alt="طلای شالیزار"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col text-right">
        <span className="font-bold text-primary dark:text-accent tracking-wide leading-none text-sm md:text-base transition-colors duration-500">
          طلای شالیزار
        </span>
        <span className="text-[9px] text-muted-foreground tracking-widest font-light mt-1 transition-colors duration-500">
          PREMIUM IRANIAN RICE
        </span>
      </div>
    </Link>
  );
};

Logo.displayName = "Logo";