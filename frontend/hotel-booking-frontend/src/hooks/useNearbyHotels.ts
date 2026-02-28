import { useEffect, useState } from "react";
import { hotelApi, ratingApi } from "../services/Hotel";
import { HotelData } from "../types/Hotels";

type Location = [number, number];

const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;

  let sum = 0;
  for (const rating of ratings) {
    sum += rating;
  }
  return sum / ratings.length;
};

const enrichHotelWithAverageRating = async (hotel: HotelData): Promise<HotelData> => {
  const reviews = await ratingApi.getReviewsForHotel(hotel.id);
  const ratings = reviews.map((review) => review.rating);
  const averageRating = calculateAverageRating(ratings);
  return { ...hotel, averageRating };
};

const fetchNearbyHotelsWithRatings = async (location: Location): Promise<HotelData[]> => {
  const nearbyHotels = await hotelApi.getHotelsNearby(location[0], location[1]);
  return Promise.all(nearbyHotels.map(enrichHotelWithAverageRating));
};

export const useNearbyHotels = (location: Location | null) => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchHotels = async () => {
      try {
        const hotelsWithRatings = await fetchNearbyHotelsWithRatings(location);
        setHotels(hotelsWithRatings);
      } catch (error) {
        console.error("Failed to fetch nearby hotels:", error);
        setError("Failed to fetch nearby hotels");
      }
    };

    fetchHotels();
  }, [location]);

  return { hotels, error };
};
