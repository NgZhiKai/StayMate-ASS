import React from "react";
import { useNavigate } from "react-router-dom";
import { GradientButton } from "../../components/Button";
import { BookingCardData } from "../../types/Booking";

export const statusStyles = {
  PENDING: { bg: "bg-yellow-50", text: "text-yellow-700" },
  CONFIRMED: { bg: "bg-green-50", text: "text-green-700" },
  CANCELLED: { bg: "bg-red-50 line-through", text: "text-red-700" },
};

interface Props {
  booking: BookingCardData;
  loadingIds: number[];
  onCancel: (id: number) => void;
}

const BookingCard: React.FC<Props> = ({ booking, loadingIds, onCancel }) => {
  const navigate = useNavigate();

  // Singapore timezone
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
  today.setHours(0, 0, 0, 0);

  const checkIn = new Date(new Date(booking.checkInDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
  const checkOut = new Date(new Date(booking.checkOutDate).toLocaleString("en-US", { timeZone: "Asia/Singapore" }));

  const canCancel = booking.status !== "CANCELLED" && booking.status === "PENDING";

  const isLoading = loadingIds.includes(booking.bookingId);

  return (
    <div
      className={`p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${statusStyles[booking.status].bg}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <p className="font-semibold text-gray-800">{booking.roomType}</p>
          <p className="text-xs text-gray-500">
            {checkIn.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} →{" "}
            {checkOut.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
          </p>
        </div>
        <span className={`mt-1 text-sm font-semibold ${statusStyles[booking.status].text}`}>
          {booking.status}
        </span>
      </div>

      <div className="flex gap-2 mt-2 sm:mt-0">
        {canCancel && (
          <GradientButton
            loading={isLoading}
            onClick={() => onCancel(booking.bookingId)}
            gradient="from-red-500 via-pink-500 to-purple-500"
            className="text-sm px-3 py-1"
          >
            Cancel
          </GradientButton>
        )}

        {booking.status === "PENDING" && (
          <GradientButton
            onClick={() =>
              navigate("/select-payment", {
                state: { bookingId: booking.bookingId, hotelName: booking.hotelName },
              })
            }
            className="text-sm px-3 py-1"
          >
            Pay Now
          </GradientButton>
        )}
      </div>
    </div>
  );
};

export default BookingCard;