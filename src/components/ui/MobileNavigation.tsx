"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { X, PhoneCall } from "lucide-react";
import { Button } from "./Button";
import Link from "next/link";

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const navLinks = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/#products-showcase", label: "محصولات ممتاز" },
    { href: "/bulk-order", label: "خرید عمده" },
    { href: "/order-tracking", label: "پیگیری سفارش" },
    { href: "/blog", label: " مقالات "},
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Panel (RTL-optimized: slides from right) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[320px] bg-background/95 dark:bg-[#0E1412]/95 backdrop-blur-xl border-l border-border/30 shadow-2xl p-6 flex flex-col text-right justify-between"
          >
            {/* Top Bar */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted/20 text-foreground transition-all"
                  title="بستن منو"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-5 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="text-lg font-medium text-foreground hover:text-accent transition-colors py-1.5"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 border-t border-border/20 pt-6">
              <div className="flex items-center gap-3 justify-end text-muted-foreground">
                <span className="text-sm font-light">پشتیبانی: 09199724318</span>
                <PhoneCall className="w-4 h-4 text-accent" />
              </div>
              <Button variant="primary" className="w-full bg-primary text-white" onClick={onClose}>
                ورود / ثبت‌ نام
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

MobileNavigation.displayName = "MobileNavigation";
