import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageWrapper } from "../common/PageWrapper";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      {/* Global Luxury Header & Navigation */}
      <Navbar />

      {/* Main Body with animation transitions */}
      <main className="flex-grow flex flex-col w-full">
        <PageWrapper>{children}</PageWrapper>
      </main>

      {/* Global Luxury Footer */}
      <Footer />
    </div>
  );
};

MainLayout.displayName = "MainLayout";
