import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NearMeMap, { NearMeMapRef } from "./NearMeMap";
import HotelListPanel from "./HotelListPanel";
import { HotelData } from "../../types/Hotels";

interface NearMeLayoutProps {
  location: [number, number] | null;
  hotels: HotelData[];
}

const NearMeLayout: React.FC<NearMeLayoutProps> = ({ location, hotels }) => {
  const mapRef = useRef<NearMeMapRef>(null);
  const navigate = useNavigate();
  const [hoveredHotelId, setHoveredHotelId] = useState<number | null>(null);

  const handleHotelClick = (hotel: HotelData) => {
    navigate(`/hotel/${hotel.id}`);
  };

  const handleHotelHover = (hotel: HotelData | null) => {
    setHoveredHotelId(hotel?.id ?? null);
    if (hotel) mapRef.current?.flyToHotel(hotel);
  };

  return (
    <div className="flex gap-8 px-8 pb-16 h-[calc(100vh-240px)] relative select-none">
      {/* LEFT LIST PANEL */}
      <div className="w-2/5 relative">
        <div className="h-full overflow-y-auto pr-4 scrollbar-none scroll-smooth space-y-4">
          <HotelListPanel
            hotels={hotels}
            onHotelClick={handleHotelClick}
            onHotelHover={handleHotelHover}
            hoveredHotelId={hoveredHotelId}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* RIGHT MAP */}
      <div className="w-3/5 sticky top-6 h-[calc(100vh-260px)] rounded-3xl overflow-hidden shadow-xl">
        <NearMeMap
          ref={mapRef}
          location={location}
          hotels={hotels}
          hoveredHotelId={hoveredHotelId}
        />
      </div>
    </div>
  );
};

export default NearMeLayout;