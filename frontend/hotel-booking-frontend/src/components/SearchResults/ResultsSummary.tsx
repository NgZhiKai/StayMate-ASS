import React from "react";
import { FaThLarge, FaBars } from "react-icons/fa";

interface ResultsSummaryProps {
  city: string;
  country: string;
  hotelsCount: number;
  layout: "grid" | "list";
  toggleLayout: () => void;
  loading: boolean;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  city,
  country,
  hotelsCount,
  layout,
  toggleLayout,
  loading,
}) => {
  if (loading || hotelsCount === 0) return null;

  const location = city || country;

  return (
    <div className="w-full flex items-center mb-6">
      <div>
        <p className="text-xl font-semibold text-gray-900">
          {location} : {hotelsCount} exact matches found
        </p>
      </div>

      {/* Right: Modern pill toggle */}
        <div className="ml-auto">
          <div className="flex items-center bg-gray-100 rounded-full p-1 shadow-inner">

          {/* Grid Button */}
          <button
            onClick={() => layout !== "grid" && toggleLayout()}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              layout === "grid"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <FaThLarge className="text-sm" />
            Grid
          </button>

          {/* List Button */}
          <button
            onClick={() => layout !== "list" && toggleLayout()}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              layout === "list"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <FaBars className="text-sm" />
            List
          </button>
          </div>
      </div>
    </div>
  );
};

export default ResultsSummary;