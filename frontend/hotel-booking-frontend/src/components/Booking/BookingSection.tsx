import React from "react";
import { BookingCardData } from "../../types/Booking";
import BookingCard from "./BookingCard";

interface Props {
  title: string;
  bookings: BookingCardData[];
  loadingIds: number[];
  onCancel: (id: number) => void;
  showCount?: boolean;
}

const BookingSection: React.FC<Props> = ({ title, bookings, loadingIds, onCancel, showCount = false }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
      {title}
      {showCount && (
        <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-200 text-red-800 rounded-full">{bookings.length}</span>
      )}
    </h2>
    <div className="space-y-4">
      {bookings.map((b) => (
        <BookingCard key={b.bookingId} booking={b} loadingIds={loadingIds} onCancel={onCancel} />
      ))}
    </div>
  </div>
);

export default BookingSection;