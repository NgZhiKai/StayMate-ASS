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
  if (!hotels.length) return null;

  const defaultPosition: [number, number] = [hotels[0].latitude, hotels[0].longitude];

  // Custom icon for highlighted hotel
  const defaultIcon = new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
  });

  const highlightedIcon = new L.Icon({
    iconUrl:
      "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [36, 52],
    iconAnchor: [18, 52],
    popupAnchor: [0, -52],
  });

  return (
    <div className="h-full rounded-3xl shadow-xl overflow-hidden sticky top-20">
      <MapContainer center={defaultPosition} zoom={12} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {hotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[hotel.latitude, hotel.longitude]}
            icon={hoveredHotelId === hotel.id ? highlightedIcon : defaultIcon}
            opacity={hoveredHotelId === hotel.id ? 1 : 0.7}
          >
            {/* Show popup only when hovered */}
            {hoveredHotelId === hotel.id && (
              <Popup closeButton={false} className="rounded-2xl shadow-lg">
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
                  <p className="text-gray-500 text-sm">{hotel.address}</p>
                </div>
              </Popup>
            )}

            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent={false}>
              <span className="text-sm font-medium">{hotel.name}</span>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapSection;