"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "../ui/Logo";
import { NavigationMenu } from "../ui/NavigationMenu";
import { MobileNavigation } from "../ui/MobileNavigation";
import { SearchButton } from "../ui/SearchButton";
import { CartButton } from "../ui/CartButton";
import { WishlistButton } from "../ui/WishlistButton";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-2 sm:px-4 md:px-8 py-3 md:py-4">
      <nav className="max-w-7xl mx-auto rounded-2xl md:rounded-full glass-premium px-3 sm:px-5 md:px-6 py-3 flex items-center justify-between gap-2" aria-label="منوی اصلی">
        <Logo />
        <NavigationMenu className="hidden lg:flex" />
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
          <div className="hidden sm:block"><WishlistButton /></div>
          <CartButton />
          <div className="hidden sm:block"><SearchButton /></div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-full min-h-11 min-w-11"
            aria-label="باز کردن منوی اصلی"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

Navbar.displayName = "Navbar";
