import React from "react";
import { Typography } from "@/components/ui/Typography";
import { clsx } from "clsx";
import Image from "next/image";
import logoImg from "@/talaye-shalizar.png";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={clsx("flex items-center gap-3 select-none", className)}>
      <div className="relative w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center border border-primary/20 dark:border-accent/25 transition-all duration-500 hover:rotate-12 overflow-hidden">
        <Image
          src={logoImg}
          alt="طلای شالیزار"
          width={40}
          height={40}
          className="object-cover w-full h-full scale-110"
          priority
        />
      </div>
      <div className="flex flex-col text-right">
        <Typography variant="h4" className="font-bold text-primary dark:text-accent tracking-wide leading-none transition-colors duration-500">
          طلای شالیزار
        </Typography>
        <span className="text-[10px] text-muted-foreground tracking-widest font-light mt-0.5 transition-colors duration-500">
          PREMIUM IRANIAN RICE
        </span>
      </div>
    </div>
  );
};

Logo.displayName = "Logo";
