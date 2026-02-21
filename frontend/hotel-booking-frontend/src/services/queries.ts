import { useQuery } from "@tanstack/react-query";
import { getHotelsNearby } from "./Hotel/hotelApi";
import { getReviewsForHotel } from "./Hotel/ratingApi";

export const useNearbyHotelsQuery = (
  location: [number, number] | null
) => {
  return useQuery({
    queryKey: ["nearbyHotels", location],
    queryFn: async () => {
      if (!location) return [];

      const nearby = await getHotelsNearby(
        location[0],
        location[1]
      );

      return Promise.all(
        nearby.map(async (hotel) => {
          const reviews = await getReviewsForHotel(hotel.id);

          const averageRating =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) /
                reviews.length
              : 0;

          return { ...hotel, averageRating };
        })
      );
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 5,
  });
};