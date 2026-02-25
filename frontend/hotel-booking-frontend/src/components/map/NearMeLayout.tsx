import { useRef } from "react";
import NearMeMap, { NearMeMapRef } from "./NearMeMap";
import HotelListPanel from "./HotelListPanel";
import { HotelData } from "../../types/Hotels";

interface NearMeLayoutProps {
  location: [number, number] | null;
  hotels: HotelData[];
}

const NearMeLayout: React.FC<NearMeLayoutProps> = ({ location, hotels }) => {
  const mapRef = useRef<NearMeMapRef>(null);

  const handleHotelClick = (hotel: HotelData) => {
    mapRef.current?.flyToHotel(hotel);
  };

  return (
    <div className="flex px-8 pb-16 gap-8 h-[calc(100vh-240px)] relative select-none">
      
      {/* LEFT LIST PANEL */}
      <div className="w-2/5 relative">
        
        {/* Scrollable Container */}
        <div className="h-full overflow-y-auto pr-4 scrollbar-none scroll-smooth">
          <HotelListPanel hotels={hotels} onHotelClick={handleHotelClick} />
        </div>

        {/* Bottom Fade Gradient (Airbnb effect) */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      {/* RIGHT MAP */}
      <div className="w-3/5 sticky top-6 h-[calc(100vh-260px)] rounded-3xl overflow-hidden shadow-xl">
        <NearMeMap location={location} hotels={hotels} />
      </div>

    </div>
  );
};

export default NearMeLayout;