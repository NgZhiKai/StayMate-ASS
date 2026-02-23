import { useEffect, useState } from "react";
import { hotelApi } from "../services/Hotel";
import { ratingApi } from "../services/Hotel";
import { bookmarkApi } from "../services/User";
import { HotelData } from "../types/Hotels";

export const useBookmarkedHotels = (userId: number) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const loadHotels = async () => {
      try {
        const { hotelIds } = await bookmarkApi.getBookmarkedHotelIds(userId);
        if (!hotelIds.length) {
          setHotels([]);
          return;
        }

        const hotelData = await Promise.all(
          hotelIds.map(async (id) => {
            const hotel = await hotelApi.fetchHotelById(id);
            const reviews = await ratingApi.getReviewsForHotel(id);
            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : 0;
            return { ...hotel, averageRating };
          })
        );

        setHotels(hotelData);
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