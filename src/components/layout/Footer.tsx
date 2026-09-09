"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Logo } from "../ui/Logo";
import { Instagram } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F3EEE4] border-t border-[#E5E2DA] py-8 sm:py-12 px-4 mt-8 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-right">
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-3 min-w-0">
          <Logo />
          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
            برنج شمال از گیلان و مازندران. رقم و سال برداشت روی کیسه مشخص است.
          </p>
          <a
            href="https://www.instagram.com/Shalizar_Gold/"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center"
            aria-label="اینستاگرام طلای شالیزار"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <Typography variant="h4" className="font-semibold text-primary text-base">ارقام</Typography>
          <Link href="/products?variety=هاشمی" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">هاشمی</Link>
          <Link href="/products?variety=دم‌سیاه" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">دم‌سیاه</Link>
          <Link href="/products?variety=طارم" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">طارم</Link>
          <Link href="/products?variety=صدری" className="text-xs sm:text-sm text-muted-foreground hover:text-primary">صدری</Link>
        </div>
        <div className="flex flex-col gap-2 min-w-0">
          <Typography variant="h4" className="font-semibold text-primary text-base">تماس</Typography>
          <p className="text-xs sm:text-sm text-muted-foreground">رشت، گیلان</p>
          <Link href="/products" className="text-xs sm:text-sm text-primary">فروشگاه</Link>
          <Link href="/wishlist" className="text-xs sm:text-sm text-muted-foreground">علاقه‌مندی</Link>
        </div>
      </div>
      <p className="max-w-7xl mx-auto border-t border-[#E5E2DA] mt-8 pt-4 text-center text-[11px] text-muted-foreground">
        ۱۴۰۴ طلای شالیزار — برنج شمال
      </p>
    </footer>
  );
};

Footer.displayName = "Footer";
