"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Logo } from "../ui/Logo";
import { NavigationMenu } from "../ui/NavigationMenu";
import { MobileNavigation } from "../ui/MobileNavigation";
import { SearchButton } from "../ui/SearchButton";
import { CartButton } from "../ui/CartButton";
import { WishlistButton } from "../ui/WishlistButton";
import { ThemeToggle } from "../ui/ThemeToggle";
export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-2 sm:px-4 md:px-8 py-3 md:py-4 transition-all duration-300">
      <nav className="max-w-7xl mx-auto rounded-2xl md:rounded-full glass-premium px-3 sm:px-5 md:px-6 py-3 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Nav Links */}
        <NavigationMenu className="hidden lg:flex" />

        {/* Toolbar & Actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
          {/* Theme Toggle Switcher */}
          <div className="hidden sm:block"><ThemeToggle /></div>

          {/* Wishlist Button */}
          <div className="hidden sm:block"><WishlistButton /></div>

          {/* Cart Button */}
          <CartButton />

          {/* Search Button */}
          <div className="hidden sm:block"><SearchButton /></div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-full hover:bg-muted/20 text-foreground transition-all flex items-center justify-center cursor-pointer"
            title="منوی ناوبری همراه"
            aria-label="باز کردن منوی اصلی"
          >
            <Menu className="w-5 h-5 stroke-1.5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Slide-out Navigation */}
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

Navbar.displayName = "Navbar";
