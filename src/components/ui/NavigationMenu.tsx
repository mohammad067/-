"use client";

import React, { useState, useEffect } from "react";
import { NavigationItem } from "./NavigationItem";

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ className }) => {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    // Avoid synchronous state changes inside effect trigger
    const updatePath = () => {
      setActivePath(window.location.pathname + window.location.hash);
    };
    updatePath();
    window.addEventListener("popstate", updatePath);
    window.addEventListener("hashchange", updatePath);
    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("hashchange", updatePath);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/products", label: "محصولات ممتاز" },
    { href: "/#editorial-story", label: "درباره ما" },
    { href: "/#footer", label: "تماس با ما" },
  ];

  return (
    <div className={`flex items-center gap-8 ${className || ""}`}>
      {navLinks.map((link) => {
        const isActive = activePath === link.href ||
          (link.href === "/" && (activePath === "/" || activePath === "")) ||
          (link.href === "/#editorial-story" && activePath.endsWith("#editorial-story")) ||
          (link.href === "/#footer" && activePath.endsWith("#footer"));

        return (
          <NavigationItem
            key={link.href}
            href={link.href}
            label={link.label}
            isActive={isActive}
          />
        );
      })}
    </div>
  );
};

NavigationMenu.displayName = "NavigationMenu";
