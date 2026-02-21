import { HotelData } from "../../types/Hotels";

interface HotelListPanelProps {
  hotels: HotelData[];
  onHotelClick?: (hotel: HotelData) => void;
}

const HotelListPanel: React.FC<HotelListPanelProps> = ({ hotels, onHotelClick }) => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">{hotels.length} stays nearby</h2>
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition select-none cursor-pointer"
          onClick={() => onHotelClick && onHotelClick(hotel)}
        >
          <h3 className="font-semibold text-lg">{hotel.name}</h3>
          <p className="text-sm text-gray-500">{hotel.address}</p>
          <p className="mt-2 text-yellow-600 font-medium">
            ⭐ {hotel.averageRating?.toFixed(1)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HotelListPanel;