import { HotelData } from "../../types/Hotels";

interface HotelListPanelProps {
  hotels: HotelData[];
  onHotelClick?: (hotel: HotelData) => void;
}

const HotelListPanel: React.FC<HotelListPanelProps> = ({ hotels, onHotelClick }) => {

  const defaultImage =
    "https://archive.org/download/placeholder-image/placeholder-image.jpg";

  return (
    <div className="space-y-6 select-none pb-24">
      <div>
        <h2 className="text-2xl font-semibold">
          {hotels.length} stays nearby
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore highly rated stays around you
        </p>
      </div>

      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          onClick={() => onHotelClick && onHotelClick(hotel)}
          className="
            bg-white 
            rounded-2xl 
            shadow-sm 
            hover:shadow-xl 
            transition 
            duration-300 
            cursor-pointer 
            overflow-hidden
            group
          "
        >
          {/* IMAGE */}
          <div className="h-48 w-full overflow-hidden">
            <img
              src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          {/* CONTENT */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg leading-tight">
                {hotel.name}
              </h3>

              <div className="flex items-center text-sm font-medium">
                ⭐ {hotel.averageRating?.toFixed(1) || "New"}
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {hotel.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelListPanel;