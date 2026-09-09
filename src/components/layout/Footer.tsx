"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Logo } from "../ui/Logo";
import { Instagram } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F3EEE4] border-t border-[#E5E2DA] py-8 px-4 mt-8" dir="rtl">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-10">
        <div className="flex flex-col gap-3 items-start">
          <Logo />
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            برنج شمال از گیلان و مازندران. رقم و سال برداشت روی کیسه مشخص است.
          </p>
          <a
            href="https://www.instagram.com/Shalizar_Gold/"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center"
            aria-label="اینستاگرام طلای شالیزار"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 md:contents">
          <div className="flex flex-col gap-2">
            <Typography variant="h4" className="font-semibold text-primary text-base">ارقام</Typography>
            <Link href="/products?variety=هاشمی" className="text-sm text-muted-foreground">هاشمی</Link>
            <Link href="/products?variety=دم‌سیاه" className="text-sm text-muted-foreground">دم‌سیاه</Link>
            <Link href="/products?variety=طارم" className="text-sm text-muted-foreground">طارم</Link>
            <Link href="/products?variety=صدری" className="text-sm text-muted-foreground">صدری</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Typography variant="h4" className="font-semibold text-primary text-base">تماس</Typography>
            <p className="text-sm text-muted-foreground">رشت، گیلان</p>
            <Link href="/products" className="text-sm text-primary">فروشگاه</Link>
            <Link href="/wishlist" className="text-sm text-muted-foreground">علاقه‌مندی</Link>
          </div>
        </div>
      </div>
      <p className="max-w-7xl mx-auto border-t border-[#E5E2DA] mt-8 pt-4 text-center text-[11px] text-muted-foreground">
        ۱۴۰۴ طلای شالیزار — برنج شمال
      </p>
    </footer>
  );
};

Footer.displayName = "Footer";
