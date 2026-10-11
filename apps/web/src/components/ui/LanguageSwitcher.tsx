"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC = () => {
  const [lang, setLang] = useState<"fa" | "en">("fa");

  const toggleLanguage = () => {
    const nextLang = lang === "fa" ? "en" : "fa";
    setLang(nextLang);

    // Smooth, premium in-app UI language localization feedback
    const toast = document.createElement("div");
    toast.className = "fixed bottom-8 left-8 z-50 glass-premium px-6 py-4 rounded-3xl border border-accent/25 shadow-2xl text-xs font-bold text-foreground animate-scale-up direction-rtl";
    toast.innerHTML = nextLang === "fa"
      ? "زبان رابط کاربری به فارسی تنظیم گردید."
      : "User interface simulator language set to ENGLISH.";
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      toast.style.transition = "all 0.5s ease";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-accent"
      title="تغییر زبان"
    >
      <Globe className="w-5 h-5 stroke-1.5" />
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{lang}</span>
    </button>
  );
};

LanguageSwitcher.displayName = "LanguageSwitcher";
