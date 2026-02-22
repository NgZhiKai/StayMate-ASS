import React from "react";
import { HotelData } from "../../types/Hotels";
import { useNavigate } from "react-router-dom";
import HotelCard from "../Hotel/HotelCard";

interface HotelsGridProps {
  hotels: HotelData[];
  hoveredHotelId: number | null;
  setHoveredHotelId: (id: number | null) => void;
  layout: "grid" | "list";
  className?: string;
}

const HotelsGrid: React.FC<HotelsGridProps> = ({
  hotels,
  hoveredHotelId,
  setHoveredHotelId,
  layout,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`transition-all duration-300 w-full ${
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
          : "flex flex-col gap-5"
      }`}
    >
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="h-full transition-all duration-300"
          onClick={() => navigate(`/hotel/${hotel.id}`)}
          onMouseEnter={() => setHoveredHotelId(hotel.id)}
          onMouseLeave={() => setHoveredHotelId(null)}
        >
          <HotelCard hotel={hotel} layout={layout} />
        </div>
      ))}
    </div>
  );
};

export default HotelsGrid;