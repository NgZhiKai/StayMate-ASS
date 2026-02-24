import { useEffect, useState } from "react";
import { hotelApi } from "../services/Hotel";
import { Destination, HotelData } from "../types/Hotels";

export const useSearchResults = (city: string, country: string) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [hoveredHotelId, setHoveredHotelId] = useState<number | null>(null);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelApi.searchHotelsByLocation(city, country);
        setHotels(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load hotels. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, [city, country]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await hotelApi.fetchHotelDestinations();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to load popular destinations", err);
      }
    };
    loadDestinations();
  }, []);

  return { hotels, loading, error, destinations, hoveredHotelId, setHoveredHotelId };
};