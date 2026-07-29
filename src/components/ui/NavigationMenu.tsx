"use client";

import React, { useState, useEffect } from "react";
import { NavigationItem } from "./NavigationItem";

interface NavigationMenuProps {
  className?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ className }) => {
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    // Initial check
    setActiveHash(window.location.hash);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navLinks = [
    { href: "#", label: "صفحه اصلی" },
    { href: "#products-showcase", label: "محصولات ممتاز" },
    { href: "#categories-section", label: "دسته‌بندی‌ها" },
    { href: "#editorial-story", label: "داستان شالیزار" },
    { href: "#testimonials-section", label: "رضایت مشتریان" },
  ];

  return (
    <div className={`flex items-center gap-8 ${className || ""}`}>
      {navLinks.map((link) => (
        <NavigationItem
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={activeHash === link.href || (link.href === "#" && activeHash === "")}
        />
      ))}
    </div>
  );
};

NavigationMenu.displayName = "NavigationMenu";
