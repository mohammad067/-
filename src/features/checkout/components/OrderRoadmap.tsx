"use client";

import React from "react";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";

const STEPS = [
  { icon: CheckCircle2, label: "ثبت" },
  { icon: Package, label: "آماده‌سازی" },
  { icon: Truck, label: "ارسال" },
  { icon: Home, label: "تحویل" },
];

export const OrderRoadmap: React.FC<{ active?: number }> = ({ active = 0 }) => {
  return (
    <div className="relative pt-2" dir="rtl">
      <div className="absolute top-6 right-8 left-8 h-0.5 bg-[#E5E2DA] overflow-hidden">
        <div className="h-full bg-primary origin-right animate-[roadmap_1.6s_ease_forwards]" />
      </div>
      <div className="grid grid-cols-4 gap-2 text-center text-[11px] relative">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const on = index <= active;
          return (
            <div
              key={step.label}
              className="flex flex-col items-center gap-2"
              style={{ animation: `roadmapStep 0.45s ease ${index * 0.22}s both` }}
            >
              <span className={`w-10 h-10 rounded-full flex items-center justify-center border ${on ? "bg-primary text-white border-primary" : "bg-white text-[#1E2522] border-[#E5E2DA]"}`}>
                <Icon className="w-4 h-4" />
              </span>
              <span className={on ? "font-bold text-primary" : "text-muted-foreground"}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
