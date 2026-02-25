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

      const settledResults = await Promise.allSettled(
        result.map(async (booking) => {
          const [userResult, hotelResult] = await Promise.allSettled([
            userApi.getUserInfo(String(booking.userId)),
            hotelApi.fetchHotelById(booking.hotelId),
          ]);

          // If hotel is deleted → ignore this booking completely
          if (hotelResult.status === "rejected") {
            console.warn(
              `Hotel ${booking.hotelId} not found. Skipping booking ${booking.bookingId}`
            );
            return null;
          }

          // If user is deleted → show fallback instead of crashing
          const userFirstName =
            userResult.status === "fulfilled"
              ? userResult.value.user.firstName
              : "Deleted";

          const userLastName =
            userResult.status === "fulfilled"
              ? userResult.value.user.lastName
              : "User";

          const hotelInfo = hotelResult.value;

          return {
            ...booking,
            userFirstName,
            userLastName,
            hotelName: hotelInfo.name,
            hotelCheckInTime: hotelInfo.checkIn || "N/A",
            hotelCheckOutTime: hotelInfo.checkOut || "N/A",
          };
        })
      );

      // Keep only valid bookings
      const validBookings = settledResults
        .filter(
          (r): r is PromiseFulfilledResult<any> =>
            r.status === "fulfilled" && r.value !== null
        )
        .map((r) => r.value);

      setBookings(validBookings);
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