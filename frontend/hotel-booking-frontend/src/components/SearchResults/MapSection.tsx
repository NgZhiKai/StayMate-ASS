import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { HotelData } from "../../types/Hotels";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapSectionProps {
  hotels: HotelData[];
  hoveredHotelId: number | null;
  className?: string;
}

const MapSection: React.FC<MapSectionProps> = ({ hotels, hoveredHotelId }) => {
  // Fallback to Singapore center if no hotels
  const defaultPosition: [number, number] = hotels.length
    ? [hotels[0].latitude, hotels[0].longitude]
    : [1.3521, 103.8198];

  // Base icon for hotels
  const defaultIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });

  const highlightedIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [36, 52],
    iconAnchor: [18, 52],
    popupAnchor: [0, -52],
  });

  return (
    <div className="h-full rounded-3xl shadow-xl overflow-hidden sticky top-20 bg-gradient-to-b from-purple-50 via-pink-50 to-white p-2">
      <MapContainer
        center={defaultPosition}
        zoom={hotels.length ? 12 : 11}
        className="w-full h-full rounded-2xl shadow-inner"
      >
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />

        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={[hotel.latitude, hotel.longitude]}
              icon={hoveredHotelId === hotel.id ? highlightedIcon : defaultIcon}
              opacity={hoveredHotelId === hotel.id ? 1 : 0.7}
            >
              {hoveredHotelId === hotel.id && (
                <Popup closeButton={false} className="rounded-2xl shadow-xl p-2">
                  <div className="w-48">
                    <div className="relative h-28 rounded-xl overflow-hidden">
                      <img
                        src={
                          hotel.image
                            ? `data:image/jpeg;base64,${hotel.image}`
                            : "https://archive.org/download/placeholder-image/placeholder-image.jpg"
                        }
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <h3 className="font-semibold text-md mt-2">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm">{hotel.address}</p>
                  </div>
                </Popup>
              )}
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={0.9}
                permanent={false}
                className="bg-white/90 text-gray-900 font-medium rounded-lg px-2 py-1 shadow"
              >
                {hotel.name}
              </Tooltip>
            </Marker>
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="bg-white/80 px-4 py-2 rounded-md text-gray-700 font-medium shadow">
              No hotels to display
            </p>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default MapSection;