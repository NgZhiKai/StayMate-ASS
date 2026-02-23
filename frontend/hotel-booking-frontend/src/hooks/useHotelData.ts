import { useEffect, useState } from "react";
import { fetchHotelById } from "../services/Hotel/hotelApi";
import { getReviewsForHotel } from "../services/Hotel/ratingApi";
import { userApi } from "../services/User";
import { HotelData } from "../types/Hotels";
import { Review } from "../types/Review";

export const useHotelData = (hotelId: number) => {
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userInfo, setUserInfo] = useState<Record<number, { firstName: string; lastName: string }>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelData, reviewsData] = await Promise.all([
          fetchHotelById(hotelId),
          getReviewsForHotel(hotelId),
        ]);

        setHotel(hotelData);
        setReviews(reviewsData);

        // Fetch unique users only
        const uniqueUserIds = [...new Set(reviewsData.map(r => r.userId))];

        const users = await Promise.all(
          uniqueUserIds.map(id => userApi.getUserInfo(String(id)))
        );

        const userMap = users.reduce((acc, user, index) => {
          acc[uniqueUserIds[index]] = user.user;
          return acc;
        }, {} as Record<number, { firstName: string; lastName: string }>);

        setUserInfo(userMap);

      } catch (error) {
        console.error("Error fetching hotel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hotelId]);

  return {
    loading,
    hotel,
    reviews,
    userInfo,
    setReviews,
    setUserInfo,
  };
};