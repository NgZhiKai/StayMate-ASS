import React, { useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { HotelData } from "../../types/Hotels";
import { useBookmark } from "../../hooks";

interface HotelCardProps {
  hotel: HotelData;
  layout?: "grid" | "list";
  hovered?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, layout = "grid", hovered = false }) => {
  const [expanded, setExpanded] = useState(false);

  const defaultImage =
    "https://archive.org/download/placeholder-image/placeholder-image.jpg";

  const minPrice = hotel.minPrice ?? 0;
  const maxPrice = hotel.maxPrice ?? 0;
  const description = hotel.description || "No description available.";
  const avgRating = hotel.averageRating ?? 0;

  // Get userId from sessionStorage
  const currentUserId = sessionStorage.getItem("userId")
    ? Number(sessionStorage.getItem("userId"))
    : null;

  // Bookmark hook
  const { isBookmarked, canBookmark, toggleBookmark } = useBookmark(currentUserId, hotel?.id || null);

  return (
    <div
      className={`group cursor-pointer h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white to-pink-50 select-none
        flex ${layout === "list" ? "flex-row gap-6 p-4" : "flex-col"} 
        shadow-lg transition-all duration-300 relative
        ${hovered ? "shadow-2xl scale-105" : "hover:shadow-2xl hover:scale-105"}`}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          layout === "list" ? "w-44 h-32 flex-shrink-0 rounded-xl" : "w-full aspect-[4/3] rounded-2xl"
        }`}
      >
        <img
          src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl`}
        >
          <span className="text-white font-semibold text-lg bg-pink-600/80 px-3 py-1 rounded">
            View Hotel
          </span>
        </div>

        {/* Rating Badge */}
        {avgRating != null && (
          <div className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow">
            ⭐ {avgRating.toFixed(1)}
          </div>
        )}

        {/* Heart / Bookmark Button */}
        {currentUserId && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark();
            }}
            className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/80 text-pink-600 hover:bg-pink-100 hover:scale-110 shadow-md transition"
            title={canBookmark ? "Bookmark" : "Login to bookmark"}
            disabled={!canBookmark}
          >
            {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${layout === "grid" ? "p-4" : ""}`}>
        <div>
          {/* Hotel Name */}
          <h3 className="font-extrabold text-lg sm:text-xl leading-snug bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent animate-gradient">
            {hotel.name}
          </h3>

          <p className="text-sm text-gray-700 mt-1">{hotel.address}</p>

          {/* Description */}
          {layout === "grid" ? (
            <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
              {description}
            </p>
          ) : (
            <>
              <p className={`text-sm text-gray-600 mt-3 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
                {description}
              </p>
              {description.length > 120 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setExpanded(!expanded);
                  }}
                  className="text-sm text-pink-600 font-medium mt-1 hover:underline"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto pt-4 text-base font-semibold">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
            ${minPrice} – ${maxPrice}
          </span>
          <span className="text-gray-500 font-normal text-sm"> / night</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
