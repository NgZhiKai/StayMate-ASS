import { useEffect, useState } from "react";
import { getHotelsNearby } from "../services/Hotel/hotelApi";
import { getReviewsForHotel } from "../services/Hotel/ratingApi";
import { HotelData } from "../types/Hotels";

export const useNearbyHotels = (
  location: [number, number] | null
) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchHotels = async () => {
      try {
        const nearbyHotels = await getHotelsNearby(
          location[0],
          location[1]
        );

        const hotelsWithRatings = await Promise.all(
          nearbyHotels.map(async (hotel) => {
            const reviews = await getReviewsForHotel(hotel.id);

            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                  reviews.length
                : 0;

            return { ...hotel, averageRating };
          })
        );

        setHotels(hotelsWithRatings);
      } catch {
        setError("Failed to fetch nearby hotels");
      }
    };

    fetchHotels();
  }, [location]);

  return { hotels, error };
};