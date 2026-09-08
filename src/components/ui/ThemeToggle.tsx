"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <button
      type="button"
      aria-pressed={isDarkMode}
      aria-label={isDarkMode ? "فعال کردن حالت روشن" : "فعال کردن حالت تاریک"}
      className="p-2.5 rounded-full min-h-11 min-w-11 hover:bg-white"
      onClick={() => {
        const next = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
        setIsDarkMode(next);
      }}
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};

ThemeToggle.displayName = "ThemeToggle";
