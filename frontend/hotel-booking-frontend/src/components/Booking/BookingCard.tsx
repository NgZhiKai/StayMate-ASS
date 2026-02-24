import React from "react";
import { useNavigate } from "react-router-dom";
import { BookingCardData } from "../../types/Booking";

// Status styles
export const statusStyles = {
  PENDING: {
    bg: "bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100",
    text: "text-yellow-700",
  },
  CONFIRMED: {
    bg: "bg-gradient-to-r from-green-100 via-green-200 to-green-100",
    text: "text-green-700",
  },
  CANCELLED: {
    bg: "bg-gradient-to-r from-red-100 via-red-200 to-red-100 line-through",
    text: "text-red-700",
  },
};

interface Props {
  booking: BookingCardData;
  loadingIds: number[];
  onCancel: (id: number) => void;
}

const BookingCard: React.FC<Props> = ({ booking, loadingIds, onCancel }) => {
  const navigate = useNavigate();

  // Determine if the booking is underway
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkOutDate);

  const isUnderway = today >= checkIn && today <= checkOut;
  const canCancel = booking.status !== "CANCELLED" && !isUnderway;

  return (
    <div
      className={`p-4 rounded-xl shadow-md hover:shadow-lg transition flex justify-between items-center ${statusStyles[booking.status].bg}`}
    >
      <div>
        <p className="font-semibold text-gray-800">{booking.roomType}</p>
        <p className="text-xs text-gray-500">
          {checkIn.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} →{" "}
          {checkOut.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
        </p>
        <p className={`mt-1 text-sm font-semibold ${statusStyles[booking.status].text}`}>
          {booking.status}
        </p>
      </div>

      <div className="flex gap-2">
        {canCancel && (
          <button
            onClick={() => onCancel(booking.bookingId)}
            disabled={loadingIds.includes(booking.bookingId)}
            className="px-3 py-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingIds.includes(booking.bookingId) ? "Cancelling..." : "Cancel"}
          </button>
        )}

        {booking.status === "PENDING" && (
          <button
            onClick={() =>
              navigate("/select-payment", { state: { bookingId: booking.bookingId, hotelName: booking.hotelName } })
            }
            className="px-3 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition"
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;