import { useEffect, useState } from "react";
import { hotelApi, ratingApi } from "../services/Hotel";
import { HotelData } from "../types/Hotels";

interface UseFeaturedHotelsReturn {
  hotels: HotelData[];
  loading: boolean;
  error: string | null;
}

export const useFeaturedHotels = (): UseFeaturedHotelsReturn => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        const allHotels = await hotelApi.fetchHotels();
        const topHotels = allHotels
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 4);

        setHotels(topHotels);
      } catch (err) {
        console.error(err);
        setError("Failed to load featured hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchTopHotels();
  }, []);

  return { hotels, loading, error };
};