import React from "react";

interface BrandingPanelProps {
  title?: string;
  subtitle?: string;
  gradient?: string;
}

const BrandingPanel: React.FC<BrandingPanelProps> = ({
  title,
  subtitle,
  gradient = "from-indigo-500 via-purple-500 to-pink-500",
}) => {
  return (
    <div className={`flex flex-col justify-center items-center text-white w-full h-full p-10 bg-gradient-to-br ${gradient}`}>
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-center opacity-90">{subtitle}</p>
    </div>
  );
};

export default BrandingPanel;