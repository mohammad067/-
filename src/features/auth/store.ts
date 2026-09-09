"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  name: string;
  phone: string;
  verified: boolean;
  login: (name: string, phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      name: "",
      phone: "",
      verified: false,
      login: (name, phone) => set({ name, phone, verified: true }),
      logout: () => set({ name: "", phone: "", verified: false }),
    }),
    { name: "talaye-shalizar-auth" }
  )
);
