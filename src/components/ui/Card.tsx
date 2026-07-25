import React from "react";
import { clsx } from "clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glass-premium";
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-3xl overflow-hidden border border-border/60 transition-all duration-500",
          {
            "bg-card text-card-foreground shadow-[0_12px_40px_-20px_rgba(0,0,0,0.04)]": variant === "default",
            "glass text-foreground": variant === "glass",
            "glass-premium text-foreground": variant === "glass-premium",
            "hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(47,93,80,0.12)] dark:hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)]": hoverEffect,
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

Card.displayName = "Card";

export const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("p-6 md:p-8 pb-4", className)} {...props}>
    {children}
  </div>
);
CardHeader.displayName = "CardHeader";

export const CardBody = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("px-6 md:px-8 py-2", className)} {...props}>
    {children}
  </div>
);
CardBody.displayName = "CardBody";

export const CardFooter = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("p-6 md:p-8 pt-4 border-t border-border/30", className)} {...props}>
    {children}
  </div>
);
CardFooter.displayName = "CardFooter";
