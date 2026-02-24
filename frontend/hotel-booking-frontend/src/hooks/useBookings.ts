import { useState, useCallback, useEffect } from "react";
import { bookingApi } from "../services/Booking";
import { userApi } from "../services/User";
import { hotelApi } from "../services/Hotel";
import { DetailedBooking } from "../types/Booking";

export const useBookings = () => {
  const [bookings, setBookings] = useState<DetailedBooking[]>([]);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      const result: DetailedBooking[] = await bookingApi.fetchBookings();

      const detailedBookings = await Promise.all(
        result.map(async (booking) => {
          const [userInfo, hotelInfo] = await Promise.all([
            userApi.getUserInfo(String(booking.userId)),
            hotelApi.fetchHotelById(booking.hotelId),
          ]);

          return {
            ...booking,
            userFirstName: userInfo.user.firstName,
            userLastName: userInfo.user.lastName,
            hotelName: hotelInfo.name,
            hotelCheckInTime: hotelInfo.checkIn || "N/A",
            hotelCheckOutTime: hotelInfo.checkOut || "N/A",
          };
        })
      );

      setBookings(detailedBookings);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load bookings");
    }
  }, []);

  const cancelBooking = async (bookingId: number) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, error, fetchBookings, cancelBooking, setBookings };
};