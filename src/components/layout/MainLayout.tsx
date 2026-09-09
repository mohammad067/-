import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PageWrapper } from "../common/PageWrapper";
import { Toast } from "../common/Toast";

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main id="content" className="flex-grow flex flex-col w-full">
        <PageWrapper>{children}</PageWrapper>
      </main>
      <Footer />
      <Toast />
    </div>
  );
};

MainLayout.displayName = "MainLayout";
