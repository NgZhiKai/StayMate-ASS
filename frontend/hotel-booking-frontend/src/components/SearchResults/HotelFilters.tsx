import React from "react";
import { Star } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

interface HotelFiltersProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    minRating: number;
  };
  setFilters: (filters: any) => void;
  minHotelPrice: number;
  maxHotelPrice: number;
}

const ratingValues = [1, 2, 3, 4, 5];
const PRICE_STEP = 1;

const HotelFilters: React.FC<HotelFiltersProps> = ({
  filters,
  setFilters,
  minHotelPrice,
  maxHotelPrice,
}) => {
  const handleRatingClick = (rating: number) =>
    setFilters({ ...filters, minRating: rating });

  const clearFilters = () =>
    setFilters({
      minPrice: minHotelPrice,
      maxPrice: maxHotelPrice,
      minRating: 0,
    });

  const minPrice = Math.max(
    Math.ceil(filters.minPrice / PRICE_STEP) * PRICE_STEP,
    minHotelPrice
  );
  const maxPrice = Math.min(
    Math.floor(filters.maxPrice / PRICE_STEP) * PRICE_STEP,
    maxHotelPrice
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-indigo-500 hover:underline"
        >
          Clear Filters
        </button>
      </div>

      {/* Filters Body */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Price Range
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 font-medium">${minPrice}</span>
            <div className="flex-1">
              <Range
                step={PRICE_STEP}
                min={minHotelPrice}
                max={maxHotelPrice}
                values={[minPrice, maxPrice]}
                onChange={(values) =>
                  setFilters({
                    ...filters,
                    minPrice: values[0],
                    maxPrice: values[1],
                  })
                }
                renderTrack={({ props, children }) => (
                  <div
                    {...(props as any)} // TS-safe fix
                    style={{
                      ...props.style,
                      height: "8px",
                      borderRadius: "8px",
                      background: getTrackBackground({
                        values: [minPrice, maxPrice],
                        colors: ["#F87171", "#FBBF24", "#34D399"],
                        min: minHotelPrice,
                        max: maxHotelPrice,
                      }),
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...(props as any)} // TS-safe fix
                    style={{
                      ...props.style,
                      height: "24px",
                      width: "24px",
                      borderRadius: "50%",
                      backgroundColor: "#6366F1",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      border: "2px solid white",
                    }}
                  />
                )}
              />
            </div>
            <span className="text-gray-500 font-medium">${maxPrice}</span>
          </div>
        </div>

        {/* Rating Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Minimum Rating
          </h3>
          <div className="flex flex-wrap gap-2">
            {ratingValues.map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition
                  ${
                    filters.minRating === rating
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-transparent"
                      : "border border-gray-300 hover:border-gray-500 text-gray-700"
                  }`}
              >
                {rating} <Star size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelFilters;