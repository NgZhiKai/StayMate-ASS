import React, { useState } from "react";
import { HotelData } from "../../types/Hotels";
import { useNavigate } from "react-router-dom";

interface HotelCardProps {
  hotel: HotelData;
  layout?: "grid" | "list";
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, layout = "grid" }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const defaultImage =
    "https://archive.org/download/placeholder-image/placeholder-image.jpg";

  const minPrice = Math.min(...hotel.rooms.map((r) => r.pricePerNight));
  const maxPrice = Math.max(...hotel.rooms.map((r) => r.pricePerNight));
  const description = hotel.description || "No description available.";

  const handleClick = () => {
    navigate(`/hotel/${hotel.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer h-full bg-gradient-to-br from-white to-pink-50 rounded-2xl border border-gray-100 select-none
        overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
        ${layout === "list" ? "flex gap-6 p-4" : "flex flex-col"}`}
    >
      {/* Image Section */}
      <div
        className={`relative overflow-hidden ${
          layout === "list" ? "w-44 h-32 flex-shrink-0 rounded-xl" : "w-full aspect-[4/3]"
        }`}
      >
        <img
          src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
          <span className="text-white font-semibold text-lg bg-pink-600/80 px-3 py-1 rounded">
            View Hotel
          </span>
        </div>

        {/* Rating Badge */}
        {hotel.averageRating !== undefined && hotel.averageRating !== null && (
          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow">
            ⭐ {hotel.averageRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-1 ${layout === "grid" ? "p-4" : ""}`}>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 leading-snug">{hotel.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>

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
                  onClick={(e) => {
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
        <div className="mt-auto pt-4 text-base font-semibold text-gray-900">
          ${minPrice} – ${maxPrice}
          <span className="text-gray-500 font-normal text-sm"> / night</span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;