import React from "react";

interface SectionProps {
  title: string;
  gradient?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, gradient, children }) => (
  <div className="rounded-xl shadow-lg p-6 flex flex-col space-y-4 bg-gray-50 border border-gray-200">
    <h3
      className={`text-gray-700 font-semibold text-lg ${
        gradient ? `bg-clip-text text-transparent bg-gradient-to-r ${gradient}` : ""
      }`}
    >
      {title}
    </h3>
    {children}
  </div>
);

export default Section;