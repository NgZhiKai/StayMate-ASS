import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { HotelData } from "../../types/Hotels";

export interface NearMeMapRef {
  flyToHotel: (hotel: HotelData) => void;
}

interface NearMeMapProps {
  location: [number, number] | null;
  hotels: HotelData[];
  hoveredHotelId?: number | null;
}

// Component to smoothly fly map to a hotel when hovered
const MapFlyer = ({ hotel }: { hotel: HotelData | null }) => {
  const map = useMap();
  if (hotel) {
    map.flyTo([hotel.latitude, hotel.longitude], 15, { duration: 1.5 });
  }
  return null;
};

const MapRefBridge = ({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) => {
  const map = useMap();
  mapRef.current = map;
  return null;
};

const NearMeMap = forwardRef<NearMeMapRef, NearMeMapProps>(
  ({ location, hotels, hoveredHotelId }, ref) => {
    const leafletMapRef = useRef<L.Map | null>(null);

    useImperativeHandle(ref, () => ({
      flyToHotel: (hotel: HotelData) => {
        leafletMapRef.current?.flyTo([hotel.latitude, hotel.longitude], 15, { duration: 1.5 });
      },
    }), []);

    if (!location) return <div className="w-full h-full bg-gray-200">Loading map...</div>;

    // Helper: create a modern marker icon
    const createMarkerIcon = (hovered: boolean) =>
      L.divIcon({
        html: `
          <div style="
            width: ${hovered ? 32 : 24}px;
            height: ${hovered ? 32 : 24}px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border: 3px solid white;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            ${hovered ? '⭐' : ''}
          </div>
        `,
        className: "",
        iconSize: [hovered ? 32 : 24, hovered ? 32 : 24],
        iconAnchor: [hovered ? 16 : 12, hovered ? 16 : 12],
      });

    return (
      <MapContainer
        center={location}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full rounded-3xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <MapRefBridge mapRef={leafletMapRef} />

        {hotels
          .filter(hotel => hotel.latitude != null && hotel.longitude != null)
          .map((hotel) => {
            const isHovered = hoveredHotelId === hotel.id;
            return (
              <Marker
                key={hotel.id}
                position={[hotel.latitude, hotel.longitude]}
                icon={createMarkerIcon(isHovered)}
              >
                <Popup>
                  <div className="font-semibold">{hotel.name}</div>
                  <div className="text-xs text-gray-600">{hotel.address}</div>
                  <div className="text-sm mt-1">⭐ {hotel.averageRating?.toFixed(1) || "New"}</div>
                </Popup>
              </Marker>
            );
          })}

        {/* Smoothly fly to hovered hotel */}
        {hoveredHotelId && <MapFlyer hotel={hotels.find(h => h.id === hoveredHotelId) || null} />}
      </MapContainer>
    );
  }
);

export default NearMeMap;
