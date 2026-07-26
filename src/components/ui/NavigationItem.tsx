"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import Link from "next/link";

interface NavigationItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({ href, label, isActive = false, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "relative py-2 px-1 text-sm font-medium transition-colors duration-300 select-none group",
        isActive ? "text-accent font-semibold" : "text-foreground/80 hover:text-accent"
      )}
    >
      <span>{label}</span>
      {isActive && (
        <motion.span
          layoutId="activeUnderline"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {!isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
      )}
    </Link>
  );
};

NavigationItem.displayName = "NavigationItem";
