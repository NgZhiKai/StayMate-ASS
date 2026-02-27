import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookingsByStatus, HotelHeader, NoBookings } from "../../components/Booking";
import { useBookingContext } from "../../contexts/BookingContext";
import { bookingApi } from "../../services/Booking";
import { BookingCardData } from "../../types/Booking";

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

  // Filter bookings based on location state
  useEffect(() => {
    if (!state?.bookingIds) return;

    const filtered = bookings
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
      await bookingApi.cancelBooking(bookingId);
      updateBookingStatus(bookingId, "CANCELLED");
    } catch (err) {
      console.error("Cancel booking failed:", err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== bookingId));
    }
  };

  if (!selectedBookings.length) return <NoBookings />;

  return (
    <div className="p-6 bg-gray-50 min-h-full select-none">
      <HotelHeader
        hotelName={state.hotelName}
        checkInDate={state.checkInDate}
        checkOutDate={state.checkOutDate}
      />

      <BookingsByStatus
        bookings={selectedBookings}
        loadingIds={loadingIds}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default BookingPage;