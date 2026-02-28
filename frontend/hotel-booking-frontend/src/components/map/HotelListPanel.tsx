import { HotelData } from "../../types/Hotels";

interface HotelListPanelProps {
  hotels: HotelData[];
  hoveredHotelId?: number | null;
  onHotelClick?: (hotel: HotelData) => void;
  onHotelHover?: (hotel: HotelData | null) => void;
}

const HotelListPanel: React.FC<HotelListPanelProps> = ({
  hotels,
  hoveredHotelId,
  onHotelClick,
  onHotelHover,
}) => {
  const defaultImage =
    "https://archive.org/download/placeholder-image/placeholder-image.jpg";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{hotels.length} stays nearby</h2>
        <p className="text-sm text-gray-500 mt-1">Explore highly rated stays around you</p>
      </div>

      {hotels.map((hotel) => {
        const isHovered = hoveredHotelId === hotel.id;

        return (
          <button
            type="button"
            key={hotel.id}
            onClick={() => onHotelClick?.(hotel)}
            onMouseEnter={() => onHotelHover?.(hotel)}
            onMouseLeave={() => onHotelHover?.(null)}
            onFocus={() => onHotelHover?.(hotel)}
            onBlur={() => onHotelHover?.(null)}
            className={`
              relative w-full text-left bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
              ${isHovered ? "border-2 border-indigo-500 shadow-lg scale-[1.03]" : ""}
            `}
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg leading-tight">{hotel.name}</h3>
                <div className="flex items-center text-sm font-medium">
                  ⭐ {hotel.averageRating?.toFixed(1) || "New"}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{hotel.address}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HotelListPanel;
