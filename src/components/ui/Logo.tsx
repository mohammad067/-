/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Typography } from "@/components/ui/Typography";
import { clsx } from "clsx";

import icon from "../../app/logo.png";


interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (

    <div className={clsx("flex items-center gap-3 select-none cursor-pointer", className)}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        <img
          src={icon.src}
          alt="طلای شالیزار"
          className="w-10 h-10 object-contain drop-shadow-[0_2px_10px_rgba(200,167,93,0.15)]"

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
