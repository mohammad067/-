import React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "ghost" | "glass";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyle = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-97 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      primary: "bg-primary text-primary-foreground hover:bg-[#23483E] hover:shadow-[0_8px_30px_rgb(47,93,80,0.2)] focus:ring-primary",
      accent: "bg-accent text-accent-foreground hover:bg-[#B79650] hover:shadow-[0_8px_30px_rgb(200,167,93,0.2)] focus:ring-accent",
      outline: "border border-border text-foreground hover:bg-muted/10 focus:ring-primary",
      ghost: "text-foreground hover:bg-muted/20 focus:ring-primary",
      glass: "glass text-foreground hover:bg-white/30 dark:hover:bg-white/10 hover:shadow-lg focus:ring-primary border border-white/20",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-xs md:text-sm",
      md: "px-6 py-3 text-sm md:text-base",
      lg: "px-8 py-4 text-base md:text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(baseStyle, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
