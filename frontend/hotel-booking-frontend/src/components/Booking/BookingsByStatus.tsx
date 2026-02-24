import React from "react";
import { BookingCardData } from "../../types/Booking";
import BookingSection from "./BookingSection";

interface Props {
  bookings: BookingCardData[];
  loadingIds: number[];
  onCancel: (bookingId: number) => void;
}

const BookingsByStatus: React.FC<Props> = ({ bookings, loadingIds, onCancel }) => {
  const bookingsByStatus = {
    PENDING: bookings.filter((b) => b.status === "PENDING"),
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED"),
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED"),
  };

  return (
    <>
      {bookingsByStatus.PENDING.length > 0 && (
        <BookingSection
          title="Pending Bookings"
          bookings={bookingsByStatus.PENDING}
          loadingIds={loadingIds}
          onCancel={onCancel}
        />
      )}

      {bookingsByStatus.CONFIRMED.length > 0 && (
        <BookingSection
          title="Confirmed Bookings"
          bookings={bookingsByStatus.CONFIRMED}
          loadingIds={loadingIds}
          onCancel={onCancel}
        />
      )}

      {bookingsByStatus.CANCELLED.length > 0 && (
        <BookingSection
          title="Cancelled Bookings"
          bookings={bookingsByStatus.CANCELLED}
          loadingIds={loadingIds}
          onCancel={onCancel}
          showCount
        />
      )}
    </>
  );
};

export default BookingsByStatus;