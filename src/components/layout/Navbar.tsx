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
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchClick = () => {
    // Scroll or focus on search elements in /products page or homepage
    const searchInput = document.getElementById("catalog-search-input");
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => searchInput.focus(), 500);
    } else {
      window.location.href = "/products";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-4 transition-all duration-300">
      <nav className="max-w-7xl mx-auto rounded-full glass-premium px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo />

        {/* Desktop Nav Links */}
        <NavigationMenu className="hidden md:flex" />

        {/* Toolbar & Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle Switcher */}
          <ThemeToggle />

          {/* Wishlist Button */}
          <WishlistButton />

          {/* Cart Button */}
          <CartButton />

          {/* Search Button */}
          <SearchButton onClick={handleSearchClick} />

          {/* User Sign-In Account Button CTA */}
          <Button
            variant="primary"
            size="sm"
            className="hidden lg:inline-flex bg-primary text-white border-none"
            onClick={() => alert("فرم عضویت طلایی / ورود مشتری به زودی راه‌اندازی می‌گردد.")}
          >
            ورود / ثبت‌نام
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 rounded-full hover:bg-muted/20 text-foreground transition-all flex items-center justify-center cursor-pointer"
            title="منوی ناوبری همراه"
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
