import React from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = "text", id, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-right">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-foreground/80 pr-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          id={id}
          className={clsx(
            "w-full px-5 py-3 rounded-full border bg-background/50 text-foreground text-sm transition-all duration-300",
            error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-border focus:ring-primary focus:border-primary",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 pr-1 transition-all duration-300">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-muted-foreground pr-1 font-light">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
