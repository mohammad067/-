"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Avoid synchronous state changes directly within effect block
    const isDark = document.documentElement.classList.contains("dark");
    const timer = setTimeout(() => {
      setIsDarkMode(isDark);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDarkMode(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDarkMode(true);
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full hover:bg-muted/20 text-foreground/80 hover:text-accent transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-accent"
      title={isDarkMode ? "حالت روشن" : "حالت تاریک"}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 stroke-1.5 text-accent animate-spin-slow" />
      ) : (
        <Moon className="w-5 h-5 stroke-1.5" />
      )}
    </button>
  );
};

ThemeToggle.displayName = "ThemeToggle";
