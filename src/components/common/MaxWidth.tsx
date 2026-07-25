import React from "react";
import { clsx } from "clsx";

interface MaxWidthProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const MaxWidth: React.FC<MaxWidthProps> = ({ className, size = "xl", children, ...props }) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx(
        "w-full mx-auto px-4 sm:px-6 md:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

MaxWidth.displayName = "MaxWidth";
