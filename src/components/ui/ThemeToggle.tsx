"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
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
