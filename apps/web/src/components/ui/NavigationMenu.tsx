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

    // Set initial check asynchronously to avoid synchronous setState inside render/effect warning
    const timer = setTimeout(() => {
      setActiveHash(window.location.hash || window.location.pathname);
    }, 0);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      clearTimeout(timer);
    };
  }, []);

  const navLinks = [

    { href: "/", label: "صفحه اصلی" },
    { href: "/#products-showcase", label: "محصولات ممتاز" },
    { href: "/bulk-order", label: "خرید عمده" },
    { href: "/order-tracking", label: "پیگیری سفارش" },
    
    { href: "/blog", label: " مقالات "},
  ];

  return (
    <div className={`flex items-center gap-8 ${className || ""}`}>
      {navLinks.map((link) => (
        <NavigationItem
          key={link.href}
          href={link.href}
          label={link.label}
          isActive={activeHash === link.href || (link.href === "/" && activeHash === "") || (link.href === "/bulk-order" && activeHash.includes("bulk-order")) || (link.href === "/order-tracking" && activeHash.includes("order-tracking"))}
        />
      ))}
    </div>
  );
};

NavigationMenu.displayName = "NavigationMenu";
