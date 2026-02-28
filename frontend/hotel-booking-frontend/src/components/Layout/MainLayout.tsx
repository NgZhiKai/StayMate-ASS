import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Sidebar } from "../Misc";

const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Main content */}
      <div className={`flex-1 transition-[margin] duration-300 ease-out ${isOpen ? "md:ml-64" : "md:ml-0"}`}>
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isOpen} />

        {/* Page content */}
        <main className="pt-16 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
