import React from "react";
import { Booking } from "../../types/Booking";
import { Room } from "../../types/Room";

interface CreateBookingFormProps {
  bookingData: Booking;
  rooms: Room[];
  isSubmitting: boolean;
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoomSelect: (roomType: string, selectedCount: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CreateBookingForm: React.FC<CreateBookingFormProps> = ({
  bookingData,
  rooms,
  isSubmitting,
  errors,
  handleInputChange,
  handleRoomSelect,
  handleSubmit,
}) => {
  const groupedRooms = rooms.reduce<
    Record<string, { available: number; price: number }>
  >((acc, room) => {
    if (!acc[room.room_type]) {
      acc[room.room_type] = { available: 1, price: room.pricePerNight };
    } else {
      acc[room.room_type].available += 1;
    }
    return acc;
  }, {});

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg text-gray-900"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
        Create Booking
      </h2>

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-semibold">Check-in Date</label>
          <input
            type="date"
            name="checkInDate"
            value={bookingData.checkInDate}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.checkInDate && (
            <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Check-out Date</label>
          <input
            type="date"
            name="checkOutDate"
            value={bookingData.checkOutDate}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.checkOutDate && (
            <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>
          )}
        </div>
      </div>

      {/* Room Types */}
      <div className="mb-6">
        <label className="block mb-3 font-semibold">Select Rooms</label>
        {Object.entries(groupedRooms).map(([type, info]) => (
          <div
            key={type}
            className="flex items-center justify-between mb-3 p-3 bg-gray-100 rounded-lg"
          >
            <span className="font-medium">
              {type} (${info.price}/night) — {info.available} available
            </span>
            <select
              className="p-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={
                bookingData.roomIds.filter((id) =>
                  rooms
                    .filter((r) => r.room_type === type)
                    .map((r) => r.id.roomId)
                    .includes(id)
                ).length
              }
              onChange={(e) => handleRoomSelect(type, Number(e.target.value))}
            >
              {Array.from({ length: info.available + 1 }, (_, i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
        ))}
        {errors.roomIds && (
          <p className="text-red-500 text-sm mt-1">{errors.roomIds}</p>
        )}
      </div>

      {/* Total */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Total Amount</label>
        <input
          type="number"
          value={bookingData.totalAmount}
          readOnly
          className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 cursor-not-allowed"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-4 rounded-lg font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all duration-300 text-white shadow-md"
      >
        {isSubmitting ? "Submitting..." : "Create Booking"}
      </button>
    </form>
  );
};

export default CreateBookingForm;