import React from "react";
import { clsx } from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "success" | "warning" | "outline";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "primary", children, ...props }) => {
  const baseStyle = "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-all duration-300";

  const variantStyles = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    accent: "bg-accent/10 text-accent border border-accent/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25",
    outline: "border border-border text-foreground/80",
  };

  return (
    <span className={clsx(baseStyle, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};

Badge.displayName = "Badge";
