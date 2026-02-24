import React from "react";
import { Booking } from "../../types/Booking";

interface Props {
  bookingData: Booking;
  selectedRooms: [string, number][];
  isSubmitting: boolean;
  onSubmit: () => void;
}

const BookingSummary: React.FC<Props> = ({ bookingData, selectedRooms, isSubmitting, onSubmit }) => {
  return (
    <div className="sticky top-24 bg-white rounded-3xl shadow-2xl p-6 space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>

      {/* Dates */}
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Check-in</span>
        <span className="font-medium">{bookingData.checkInDate || "-"}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Check-out</span>
        <span className="font-medium">{bookingData.checkOutDate || "-"}</span>
      </div>

      <hr className="border-gray-200" />

      {/* Rooms */}
      <div>
        <p className="text-gray-500 mb-2">Rooms</p>
        {selectedRooms.length > 0 ? (
          selectedRooms.map(([type, count]) => (
            <div key={type} className="flex justify-between text-gray-700 mb-1">
              <span>{type}</span>
              <span>{count}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No rooms selected</p>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Total */}
      <div className="flex justify-between items-center text-lg font-bold text-indigo-600">
        <span>Total</span>
        <span>${bookingData.totalAmount}</span>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || selectedRooms.length === 0}
        className={`w-full p-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300
          ${selectedRooms.length === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500"
          }`}
      >
        {isSubmitting ? "Booking..." : `Book Now ($${bookingData.totalAmount})`}
      </button>
    </div>
  );
};

export default BookingSummary;