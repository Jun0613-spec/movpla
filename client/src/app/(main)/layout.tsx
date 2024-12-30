import React, { ReactNode } from "react";

import Navbar from "./_components/navbars/navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen max-w-[1366px] mx-auto px-5 flex flex-col">
      <Navbar />

      <main className="h-[calc(100vh_-_5rem)] overflow-scroll no-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
