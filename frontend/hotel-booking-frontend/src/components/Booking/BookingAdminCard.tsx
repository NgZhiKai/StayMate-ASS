import React from "react";
import { GradientButton } from "../Button";
import { DetailedBooking } from "../../types/Booking";
import { User, Hotel, CalendarCheck, CalendarX } from "lucide-react";

interface BookingCardProps {
  booking: DetailedBooking;
  onCancel: (bookingId: number) => void;
}

export const BookingAdminCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const canCancel =
    booking.status !== "CANCELLED" &&
    new Date(booking.checkInDate) > new Date();

  const formatShortDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const formatTime = (time?: string) =>
    time ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";

  // Status colors
  let statusColor = "bg-yellow-100 text-yellow-800";
  if (booking.status === "CONFIRMED") statusColor = "bg-green-100 text-green-800";
  else if (booking.status === "CANCELLED") statusColor = "bg-red-100 text-red-800";

  // Card gradient
  const cardGradient =
    booking.status === "CANCELLED"
      ? "from-gray-200/50 to-gray-300/50"
      : "from-purple-50/40 to-pink-50/40";

  let statusAccentColor = "bg-yellow-400";
  if (booking.status === "CONFIRMED") statusAccentColor = "bg-green-400";
  else if (booking.status === "CANCELLED") statusAccentColor = "bg-red-400";

  return (
    <div className={`relative flex flex-col p-4 rounded-3xl shadow-md backdrop-blur-sm hover:shadow-lg hover:scale-105 transition-transform duration-300 bg-gradient-to-br ${cardGradient}`}>
      {/* Left status accent */}
      <span
        className={`absolute left-0 top-0 h-full w-1 rounded-l-3xl ${statusAccentColor}`}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-2 pl-3">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
          Booking #{booking.id}
        </h2>
        <span className={`text-xs font-medium py-1 px-2 rounded-full ${statusColor}`}>
          {booking.status}
        </span>
      </div>

      <div className="border-t border-gray-300/40 mb-2" />

      {/* Body - compact, single-line */}
      <div className="flex flex-col gap-1 text-gray-700 text-sm pl-3">
        <div className="flex items-center gap-2 truncate">
          <User size={16} className="text-gray-500 flex-shrink-0" />
          <span className="font-medium truncate">Name:</span>
          <span className="truncate">{booking.userFirstName} {booking.userLastName}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <Hotel size={16} className="text-gray-500 flex-shrink-0" />
          <span className="font-medium truncate">Hotel:</span>
          <span className="truncate">{booking.hotelName}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <CalendarCheck size={16} className="text-gray-500 flex-shrink-0" />
          <span className="font-medium truncate">Check-in:</span>
          <span className="truncate">{formatShortDate(booking.checkInDate)} at {formatTime(booking.hotelCheckInTime)}</span>
        </div>
        <div className="flex items-center gap-2 truncate">
          <CalendarX size={16} className="text-gray-500 flex-shrink-0" />
          <span className="font-medium truncate">Check-out:</span>
          <span className="truncate">{formatShortDate(booking.checkOutDate)} at {formatTime(booking.hotelCheckOutTime)}</span>
        </div>
      </div>

      {/* Action */}
      {canCancel && (
        <GradientButton
          onClick={() => onCancel(booking.id)}
          className="mt-4 w-full sm:w-auto bg-gradient-to-r from-red-400 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-red-500 hover:to-pink-600 transition-all duration-300"
        >
          Cancel Booking
        </GradientButton>
      )}
    </div>
  );
};

export default BookingAdminCard;
