import React from "react";
import { Booking } from "../../types/Booking";
import { Room } from "../../types/Room";

interface Props {
  bookingData: Booking;
  rooms: Room[];
  isSubmitting: boolean;
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleRoomSelect: (roomType: string, selectedCount: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const CreateBookingForm: React.FC<Props> = ({
  bookingData,
  rooms,
  isSubmitting,
  errors,
  handleInputChange,
  handleRoomSelect,
  handleSubmit,
}) => {
  const groupedRooms = rooms.reduce<Record<string, { available: number; price: number }>>(
    (acc, room) => {
      if (!acc[room.room_type]) acc[room.room_type] = { available: 1, price: room.pricePerNight };
      else acc[room.room_type].available += 1;
      return acc;
    },
    {}
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-3xl mx-auto"
    >
      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Create Booking
      </h2>

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["checkInDate", "checkOutDate"].map((field, i) => (
          <div key={i} className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700 capitalize">
              {field === "checkInDate" ? "Check-in Date" : "Check-out Date"}
            </label>
            <input
              type="date"
              name={field}
              value={bookingData[field as keyof Booking] as string}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}
      </div>

      {/* Rooms Selection */}
      <div>
        <label className="block mb-3 font-semibold text-gray-700">Select Rooms</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedRooms).map(([type, info]) => {
            const selectedCount = bookingData.roomIds.filter((id) =>
              rooms.filter((r) => r.room_type === type).map((r) => r.id.roomId).includes(id)
            ).length;

            const isSelected = selectedCount > 0;

            return (
              <div
                key={type}
                className={`
                  p-4 rounded-2xl flex flex-col transition-shadow duration-300
                  ${isSelected
                    ? "bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 shadow-xl border-2 border-transparent"
                    : "bg-white shadow hover:shadow-lg border border-gray-200"
                  }
                `}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-800">{type}</p>
                  <p className="text-sm text-gray-500">
                    ${info.price}/night — {info.available} available
                  </p>
                </div>

                {/* Dropdown */}
                <div className="relative w-24">
                  <select
                    value={selectedCount}
                    onChange={(e) => handleRoomSelect(type, Number(e.target.value))}
                    className={`
                      w-full p-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none bg-white
                      ${isSelected ? "font-semibold text-indigo-700" : "text-gray-900"}
                    `}
                  >
                    {Array.from({ length: info.available + 1 }).map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {/* Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {errors.roomIds && <p className="text-red-500 text-xs mt-1">{errors.roomIds}</p>}
      </div>

      {/* Total */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">Total Amount</label>
        <input
          type="number"
          value={bookingData.totalAmount}
          readOnly
          className="w-full p-3 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 cursor-not-allowed"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full p-4 rounded-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all duration-300 text-white shadow-lg"
      >
        {isSubmitting ? "Booking..." : `Book Now ($${bookingData.totalAmount})`}
      </button>
    </form>
  );
};

export default CreateBookingForm;