import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useBookingContext, Booking } from "../../contexts/BookingContext";
import { cancelBooking } from "../../services/Booking/bookingApi";

import HotelHeader from "../../components/Booking/HotelHeader";
import BookingSection from "../../components/Booking/BookingSection";
import { BookingCardData } from "../../components/Booking/BookingCard";

const BookingPage: React.FC = () => {
  const location = useLocation();
  const { bookings, updateBookingStatus } = useBookingContext();
  const [selectedBookings, setSelectedBookings] = useState<BookingCardData[]>([]);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const state = location.state as {
    bookingIds: number[];
    hotelName: string;
    checkInDate: string;
    checkOutDate: string;
  };

  useEffect(() => {
    if (!state?.bookingIds) return;

    const filtered: BookingCardData[] = bookings
      .filter((b) => state.bookingIds.includes(b.bookingId))
      .map((b) => ({
        bookingId: b.bookingId,
        roomType: b.roomType,
        status: b.status,
        hotelName: state.hotelName,
        checkInDate: state.checkInDate,
        checkOutDate: state.checkOutDate,
      }));

    setSelectedBookings(filtered);
  }, [bookings, state]);

  const handleCancel = async (bookingId: number) => {
    try {
      setLoadingIds((prev) => [...prev, bookingId]);
      await cancelBooking(bookingId);
      updateBookingStatus(bookingId, "CANCELLED");
    } catch (err) {
      console.error("Cancel booking failed:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  if (!selectedBookings.length)
    return <div className="flex justify-center items-center h-full text-gray-400">No bookings found.</div>;

  const bookingsByStatus = {
    PENDING: selectedBookings.filter((b) => b.status === "PENDING"),
    CONFIRMED: selectedBookings.filter((b) => b.status === "CONFIRMED"),
    CANCELLED: selectedBookings.filter((b) => b.status === "CANCELLED"),
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full select-none">
      <HotelHeader hotelName={state?.hotelName} checkInDate={state.checkInDate} checkOutDate={state.checkOutDate} />

      {bookingsByStatus.PENDING.length > 0 && (
        <BookingSection
          title="Pending Bookings"
          bookings={bookingsByStatus.PENDING}
          loadingIds={loadingIds}
          onCancel={handleCancel}
        />
      )}

      {bookingsByStatus.CONFIRMED.length > 0 && (
        <BookingSection
          title="Confirmed Bookings"
          bookings={bookingsByStatus.CONFIRMED}
          loadingIds={loadingIds}
          onCancel={handleCancel}
        />
      )}

      {bookingsByStatus.CANCELLED.length > 0 && (
        <BookingSection
          title="Cancelled Bookings"
          bookings={bookingsByStatus.CANCELLED}
          loadingIds={loadingIds}
          onCancel={handleCancel}
          showCount
        />
      )}
    </div>
  );
};

export default BookingPage;