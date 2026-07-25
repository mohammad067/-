import React from "react";
import { clsx } from "clsx";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  clean?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ className, clean = false, children, ...props }) => {
  return (
    <div
      className={clsx(
        "w-full mx-auto",
        clean ? "" : "max-w-7xl px-4 sm:px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = "Container";
