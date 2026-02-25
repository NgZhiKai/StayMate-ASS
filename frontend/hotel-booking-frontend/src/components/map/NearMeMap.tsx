import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L, { Map as LeafletMap, LatLngExpression } from "leaflet";
import { HotelData } from "../../types/Hotels";
import { forwardRef, useImperativeHandle, useRef, useEffect } from "react";

interface NearMeMapProps {
  location: [number, number] | null;
  hotels: HotelData[];
}

export interface NearMeMapRef {
  flyToHotel: (hotel: HotelData) => void;
}

// Child component to safely assign mapRef using useMap
const SetMapRef: React.FC<{ mapRef: React.MutableRefObject<LeafletMap | null> }> = ({ mapRef }) => {
  const map = useMap();
  mapRef.current = map;
  return null;
};

const NearMeMap = forwardRef<NearMeMapRef, NearMeMapProps>(({ location, hotels }, ref) => {
  const mapRef = useRef<LeafletMap | null>(null);

  // Expose flyToHotel via ref
  useImperativeHandle(ref, () => ({
    flyToHotel: (hotel: HotelData) => {
      if (mapRef.current) {
        mapRef.current.flyTo([hotel.latitude, hotel.longitude], 16, { duration: 1.5 });
      }
    },
  }));

  const userIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
  });

  const hotelIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconSize: [25, 41],
  });

  // Filter out invalid hotel coordinates
  const validHotels = hotels.filter((h) => {
    const lat = Number(h.latitude);
    const lng = Number(h.longitude);
    const isValid = !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    if (!isValid) {
      console.warn(`Skipping hotel with invalid coords: ${h.name} (${h.latitude}, ${h.longitude})`);
    }
    return isValid;
  });

  // Auto-fit bounds to include user and all valid hotels
  useEffect(() => {
    if (mapRef.current && validHotels.length) {
      const bounds = L.latLngBounds(
        validHotels.map((h) => [Number(h.latitude), Number(h.longitude)] as LatLngExpression)
      );
      if (location) bounds.extend(location);
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [validHotels, location]);

  return (
    <MapContainer
      center={(location || [51.505, -0.09]) as LatLngExpression}
      zoom={13}
      className="h-full w-full rounded-3xl"
      zoomControl={false}
    >
      <SetMapRef mapRef={mapRef} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {location && (
        <>
          <Circle
            center={location}
            radius={10000}
            pathOptions={{ color: "#2563EB", fillColor: "#2563EB", fillOpacity: 0.1 }}
          />
          <Marker position={location} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </>
      )}

      <MarkerClusterGroup>
        {validHotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[Number(hotel.latitude), Number(hotel.longitude)]}
            icon={hotelIcon}
          >
            <Popup>
              <div className="font-semibold">{hotel.name}</div>
              ⭐ {hotel.averageRating?.toFixed(1)}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
});

export default NearMeMap;