"use client";

import React, { useState } from "react";
import { Globe } from "lucide-react";

export const LanguageSwitcher: React.FC = () => {
  const [lang, setLang] = useState<"fa" | "en">("fa");

  const toggleLanguage = () => {
    const nextLang = lang === "fa" ? "en" : "fa";
    setLang(nextLang);
    // In real next-intl apps, we would trigger URL transitions, but here we show premium interactive feedback.
    alert(`تغییر زبان به شبیه‌ساز ${nextLang.toUpperCase()} فعال گردید.`);
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
