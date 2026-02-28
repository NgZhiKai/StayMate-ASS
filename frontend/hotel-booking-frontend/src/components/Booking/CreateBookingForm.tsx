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
}

const CreateBookingForm: React.FC<Props> = ({
  bookingData,
  rooms,
  isSubmitting,
  errors,
  handleInputChange,
  handleRoomSelect,
}) => {
  const groupedRooms = rooms.reduce<Record<string, { available: number; price: number }>>(
    (acc, room) => {
      if (acc[room.room_type]) acc[room.room_type].available += 1;
      else acc[room.room_type] = { available: 1, price: room.pricePerNight };
      return acc;
    },
    {}
  );

  const hasDates = Boolean(bookingData.checkInDate && bookingData.checkOutDate);
  const validDates =
    hasDates &&
    new Date(bookingData.checkInDate) < new Date(bookingData.checkOutDate);
  const invalidDates = hasDates && validDates === false;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 space-y-8">
      <h2 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Reserve Your Stay
      </h2>

      {invalidDates && (
        <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md font-medium text-sm">
          ⚠️ Check-in date must be before check-out date.
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["checkInDate", "checkOutDate"].map((field) => (
          <div key={field} className="relative">
            <input
              type="date"
              name={field}
              min={today}
              value={bookingData[field as keyof Booking] as string}
              onChange={handleInputChange}
              className="peer w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm peer-focus:-top-3 peer-focus:text-indigo-500 peer-focus:text-xs transition-all">
              {field === "checkInDate" ? "Check-in" : "Check-out"}
            </label>
            {errors[field] && (
              <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors[field]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Rooms */}
      <div>
        <p className="mb-3 font-semibold text-gray-700 text-lg">Select Rooms</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedRooms).map(([type, info]) => {
            const selectedCount = bookingData.roomIds.filter((id) =>
              rooms.filter((r) => r.room_type === type).map((r) => r.id.roomId).includes(id)
            ).length;

            return (
              <div
                key={type}
                className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  validDates
                    ? "bg-white shadow hover:shadow-lg border-gray-200"
                    : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="font-medium text-gray-800">{type}</p>
                  <p className="text-sm text-gray-500">
                    ${info.price}/night — {info.available} available
                  </p>
                </div>

                {validDates ? (
                  <div className="flex items-center justify-between mt-2">
                    <button
                      type="button"
                      onClick={() => selectedCount > 0 && handleRoomSelect(type, selectedCount - 1)}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="mx-4 text-gray-800 font-medium">{selectedCount}</span>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => selectedCount < info.available && handleRoomSelect(type, selectedCount + 1)}
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold hover:opacity-90"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm mt-2">Select valid dates first</p>
                )}

                {errors.roomIds && selectedCount === 0 && (
                  <p className="text-red-500 text-xs mt-2">{errors.roomIds}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CreateBookingForm;
