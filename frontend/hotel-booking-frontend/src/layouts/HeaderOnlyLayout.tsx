// layouts/HeaderOnlyLayout.tsx
import React from "react";
import Header from "../components/Header/Header";

interface HeaderOnlyLayoutProps {
  children: React.ReactNode;
}

export default function HeaderOnlyLayout({ children }: HeaderOnlyLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header without sidebar toggle */}
      <Header hideToggle />
      
      {/* Main content fills the rest */}
      <div className="flex-1 pt-16 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        {children}
      </div>
    </div>
  );
}