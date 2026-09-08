import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageWrapper } from "../common/PageWrapper";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <a href="#content" className="skip-link">
        پرش به محتوا
      </a>
      <Navbar />
      <main id="content" className="flex-grow flex flex-col w-full" tabIndex={-1}>
        <PageWrapper>{children}</PageWrapper>
      </main>
      <Footer />
    </div>
  );
};

MainLayout.displayName = "MainLayout";
