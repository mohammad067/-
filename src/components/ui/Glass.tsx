import React from "react";
import { clsx } from "clsx";

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
  borderSize?: "none" | "thin" | "thick";
  rounded?: "none" | "sm" | "md" | "lg" | "full";
}

export const Glass = React.forwardRef<HTMLDivElement, GlassProps>(
  ({ className, intensity = "medium", borderSize = "thin", rounded = "lg", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "transition-all duration-500",
          {
            "bg-white/20 dark:bg-black/10 backdrop-blur-sm": intensity === "low",
            "glass": intensity === "medium",
            "glass-premium": intensity === "high",

            "border-none": borderSize === "none",
            "border border-white/20 dark:border-white/5": borderSize === "thin",
            "border-2 border-white/30 dark:border-white/10": borderSize === "thick",

            "rounded-none": rounded === "none",
            "rounded-sm": rounded === "sm",
            "rounded-md": rounded === "md",
            "rounded-3xl": rounded === "lg",
            "rounded-full": rounded === "full",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Glass.displayName = "Glass";
