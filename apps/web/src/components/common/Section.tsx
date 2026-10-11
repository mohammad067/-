import React from "react";
import { clsx } from "clsx";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  divider?: boolean;
}

export const Section: React.FC<SectionProps> = ({ className, divider = false, children, ...props }) => {
  return (
    <section
      className={clsx(
        "py-16 md:py-24",
        divider ? "border-b border-border/35" : "",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};

Section.displayName = "Section";
