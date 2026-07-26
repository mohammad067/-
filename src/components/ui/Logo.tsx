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
      className={clsx("flex items-center gap-3 select-none", className)}
    >
      {/* لوگوی تصویری */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 dark:border-accent/25 transition-all duration-500 hover:rotate-12">
        <Image
          src="/talaye-shalizar.png"          // عکس را در public/logo.png بگذارید
          alt="طلای شالیزار"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* متن لوگو */}
      <div className="flex flex-col text-right">
        <span className="font-bold text-primary dark:text-accent tracking-wide leading-none text-lg transition-colors duration-500">
          طلای شالیزار
        </span>
        <span className="text-[10px] text-muted-foreground tracking-widest font-light mt-0.5 transition-colors duration-500">
          PREMIUM IRANIAN RICE
        </span>
      </div>
    </Link>
  );
};

Logo.displayName = "Logo";