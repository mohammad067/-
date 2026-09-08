"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Logo } from "../ui/Logo";
import { Instagram } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F3EEE4] border-t border-[#E5E2DA] py-14 px-4 md:px-8 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-right">
        <div className="flex flex-col gap-4">
          <Logo />
          <Typography variant="body-sm" className="text-muted-foreground text-sm leading-relaxed">
            برنج شمال از گیلان و مازندران. رقم و سال برداشت روی کیسه مشخص است.
          </Typography>
          <a href="https://www.instagram.com/Shalizar_Gold/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center">
            <Instagram className="w-4 h-4" />
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <Typography variant="h4" className="font-semibold text-primary">ارقام</Typography>
          <Link href="/products?variety=هاشمی" className="text-sm text-muted-foreground hover:text-primary">هاشمی</Link>
          <Link href="/products?variety=دم‌سیاه" className="text-sm text-muted-foreground hover:text-primary">دم‌سیاه</Link>
          <Link href="/products?variety=طارم" className="text-sm text-muted-foreground hover:text-primary">طارم</Link>
          <Link href="/products?variety=صدری" className="text-sm text-muted-foreground hover:text-primary">صدری</Link>
        </div>
        <div className="flex flex-col gap-3">
          <Typography variant="h4" className="font-semibold text-primary">تماس</Typography>
          <p className="text-sm text-muted-foreground">رشت، گیلان</p>
          <Link href="/products" className="text-sm text-primary">فروشگاه</Link>
        </div>
      </div>
      <p className="max-w-7xl mx-auto border-t border-[#E5E2DA] mt-10 pt-6 text-center text-xs text-muted-foreground">
        ۱۴۰۴ طلای شالیزار — برنج شمال
      </p>
    </footer>
  );
};

Footer.displayName = "Footer";
