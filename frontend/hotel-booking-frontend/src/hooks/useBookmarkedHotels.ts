import { useEffect, useState } from "react";
import { hotelApi } from "../services/Hotel";
import { bookmarkApi } from "../services/User";
import { HotelData } from "../types/Hotels";

export const useBookmarkedHotels = (userId: number) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadHotels = async () => {
      setLoading(true);
      try {
        const { hotelIds } = await bookmarkApi.getBookmarkedHotelIds(userId);

        if (!hotelIds.length) {
          setHotels([]);
          return;
        }

        // Batch fetch hotels
        const hotelsData = await hotelApi.fetchHotelsByIds(hotelIds);

        setHotels(hotelsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load bookmarked hotels.");
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, [userId]);

  return { hotels, loading, error };
};