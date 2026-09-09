import React from "react";
import { clsx } from "clsx";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "body-sm" | "caption" | "serif-title" | "serif-subtitle";
  as?: React.ElementType;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = "body", as, children, ...props }, ref) => {
    const Component = as || getDefaultElement(variant);

    const baseClasses = clsx(
      "font-[Vazirmatn,system-ui,sans-serif]",
      {
        "text-2xl md:text-4xl font-bold tracking-tight text-primary leading-snug": variant === "h1",
        "text-xl md:text-2xl font-bold text-primary leading-snug": variant === "h2",
        "text-lg md:text-xl font-semibold text-primary": variant === "h3",
        "text-base md:text-lg font-medium text-foreground": variant === "h4",
        "text-sm md:text-[15px] text-foreground/80 leading-relaxed": variant === "body",
        "text-xs md:text-sm text-foreground/70 leading-relaxed": variant === "body-sm",
        "text-xs text-muted-foreground": variant === "caption",
        "text-xl md:text-3xl text-primary font-bold leading-snug": variant === "serif-title",
        "text-sm md:text-base text-accent": variant === "serif-subtitle",
      },
      className
    );

    return (
      <Component className={baseClasses} ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";

function getDefaultElement(variant: string): React.ElementType {
  switch (variant) {
    case "h1":
    case "serif-title":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "caption":
      return "span";
    default:
      return "p";
  }
}
