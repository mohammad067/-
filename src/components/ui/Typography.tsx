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
      "transition-colors duration-300",
      {
        "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight": variant === "h1",
        "text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-snug": variant === "h2",
        "text-xl md:text-2xl font-semibold text-primary": variant === "h3",
        "text-lg md:text-xl font-medium text-foreground": variant === "h4",
        "text-base md:text-lg text-foreground/80 leading-relaxed font-light": variant === "body",
        "text-sm md:text-base text-foreground/70 leading-relaxed font-light": variant === "body-sm",
        "text-xs text-muted-foreground tracking-wide": variant === "caption",
        "font-serif text-3xl md:text-4xl lg:text-5xl text-primary font-medium tracking-wide": variant === "serif-title",
        "font-serif text-lg md:text-xl text-accent font-light italic": variant === "serif-subtitle",
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
