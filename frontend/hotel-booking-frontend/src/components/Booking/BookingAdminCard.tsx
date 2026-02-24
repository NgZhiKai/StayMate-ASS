import React from "react";
import { GradientButton } from "../Button";
import { DetailedBooking } from "../../types/Booking";

interface BookingCardProps {
  booking: DetailedBooking;
  onCancel: (bookingId: number) => void;
}

export const BookingAdminCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const canCancel = booking.status !== "CANCELLED" && new Date(booking.checkInDate) > new Date();

  return (
    <div
      className={`flex flex-col p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br ${
        booking.status === "CANCELLED" ? "from-gray-100 to-gray-200" : "from-purple-50 to-pink-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">Booking #{booking.id}</h2>
        <span
          className={`text-sm font-medium py-1 px-3 rounded-full ${
            booking.status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : booking.status === "CANCELLED"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-gray-700 text-sm">
        <div><span className="font-medium">User:</span> {booking.userFirstName} {booking.userLastName}</div>
        <div><span className="font-medium">Hotel:</span> {booking.hotelName}</div>
        <div><span className="font-medium">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()} at {booking.hotelCheckInTime?.slice(0,5)}</div>
        <div><span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()} at {booking.hotelCheckOutTime?.slice(0,5)}</div>
      </div>

      {/* Actions */}
      {canCancel && (
        <GradientButton
          onClick={() => onCancel(booking.id)}
          className="mt-auto bg-gradient-to-r from-red-400 to-pink-500 text-white py-2 rounded-lg font-medium hover:from-red-500 hover:to-pink-600 transition-all duration-300"
        >
          Cancel Booking
        </GradientButton>
      )}
    </div>
  );
};

export default BookingAdminCard;