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
    <div className="flex h-[calc(100vh-100px)]">
      {/* LEFT PANEL */}
      <div className="w-1/3 bg-white overflow-y-auto border-r">
        <HotelListPanel hotels={hotels} onHotelClick={handleHotelClick} />
      </div>

      {/* RIGHT MAP */}
      <div className="w-2/3">
        <NearMeMap ref={mapRef} location={location} hotels={hotels} />
      </div>
    </div>
  );
};

export default NearMeLayout;