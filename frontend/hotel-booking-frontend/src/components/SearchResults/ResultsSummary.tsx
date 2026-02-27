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
    <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-md">
      {/* Left: location and count */}
      <div className="mb-2 sm:mb-0">
        <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          {location}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          {hotelsCount} exact matches found
        </p>
      </div>

      {/* Right: modern pill toggle */}
      <div>
        <div className="flex items-center bg-gray-200 rounded-full p-1 shadow-inner">
          {/* Grid Button */}
          <button
            onClick={() => layout !== "grid" && toggleLayout()}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              layout === "grid"
                ? "bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 text-white shadow-lg scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow"
            }`}
          >
            <FaThLarge className="text-sm" />
            Grid
          </button>

          {/* List Button */}
          <button
            onClick={() => layout !== "list" && toggleLayout()}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              layout === "list"
                ? "bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 text-white shadow-lg scale-105"
                : "text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow"
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