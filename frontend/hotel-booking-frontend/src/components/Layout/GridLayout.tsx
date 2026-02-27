// GridLayout.tsx
import React from "react";

interface GridLayoutProps {
  columns?: number;
  gap?: string;
  children: React.ReactNode;
}

const colClasses: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

const GridLayout: React.FC<GridLayoutProps> = ({ columns = 2, gap = "gap-6", children }) => {
  const cols = colClasses[columns] || colClasses[2];
  return <div className={`grid grid-cols-1 ${cols} ${gap}`}>{children}</div>;
};

export default GridLayout;