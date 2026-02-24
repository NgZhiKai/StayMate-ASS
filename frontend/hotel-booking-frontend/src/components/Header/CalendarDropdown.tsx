import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import { useBookingContext } from "../../contexts/BookingContext";
import { hotelApi } from "../../services/Hotel";
import DropdownWrapper from "./DropdownWrapper";

interface HotelGrouped {
  hotelId: number;
  hotelName: string;
  rooms: {
    roomType: string;
    statusCounts: Record<string, number>;
  }[];
  bookingIds: number[];
  checkInDate: string;
  checkOutDate: string;
}

interface Props {
  isOpen: boolean;
}

export default function CalendarDropdown({ isOpen }: Props) {
  const navigate = useNavigate();
  const { bookings, updateBookingStatus } = useBookingContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"upcoming" | "past">("upcoming");
  const [hotelNames, setHotelNames] = useState<Record<number, string>>({});

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    bookings.forEach((b) => {
      const checkIn = new Date(`${b.checkInDate}T00:00:00+08:00`);
      const checkOut = new Date(`${b.checkOutDate}T00:00:00+08:00`);
      let current = new Date(checkIn);
      while (current <= checkOut) {
        dates.add(current.toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" }));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const checkIn = new Date(`${b.checkInDate}T00:00:00+08:00`);
      const checkOut = new Date(`${b.checkOutDate}T23:59:59+08:00`);
      const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      const isActive = selected >= checkIn && selected <= checkOut;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isUpcoming = checkIn >= today;
      const isPast = checkOut < today;

      return isActive && (viewMode === "upcoming" ? isUpcoming : isPast);
    });
  }, [bookings, selectedDate, viewMode]);

  const groupedBookings: HotelGrouped[] = useMemo(() => {
    const map: Record<number, HotelGrouped> = {};
    filteredBookings.forEach((b) => {
      if (!map[b.hotelId]) {
        map[b.hotelId] = {
          hotelId: b.hotelId,
          hotelName: hotelNames[b.hotelId] || `Hotel ${b.hotelId}`,
          rooms: [],
          bookingIds: [],
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
        };
      }
      const hotel = map[b.hotelId];
      hotel.bookingIds.push(b.bookingId);

      const room = hotel.rooms.find((r) => r.roomType === b.roomType);
      if (room) {
        room.statusCounts[b.status] = (room.statusCounts[b.status] || 0) + 1;
      } else {
        hotel.rooms.push({ roomType: b.roomType, statusCounts: { [b.status]: 1 } });
      }

      if (b.checkInDate < hotel.checkInDate) hotel.checkInDate = b.checkInDate;
      if (b.checkOutDate > hotel.checkOutDate) hotel.checkOutDate = b.checkOutDate;
    });
    return Object.values(map);
  }, [filteredBookings, hotelNames]);

  useEffect(() => {
    const idsToFetch = Array.from(new Set(filteredBookings.map((b) => b.hotelId))).filter(
      (id) => !hotelNames[id]
    );
    if (!idsToFetch.length) return;

    const fetchNames = async () => {
      const newNames: Record<number, string> = {};
      for (const id of idsToFetch) {
        try {
          const hotel = await hotelApi.fetchHotelById(id);
          newNames[id] = hotel.name;
        } catch {
          newNames[id] = `Hotel ${id}`;
        }
      }
      setHotelNames((prev) => ({ ...prev, ...newNames }));
    };
    fetchNames();
  }, [filteredBookings, hotelNames]);

  const handleKeyPress = (e: KeyboardEvent<HTMLButtonElement>, hotelId: number, hotel: HotelGrouped) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate("/bookings", {
        state: {
          bookingIds: hotel.bookingIds,
          hotelName: hotel.hotelName,
          checkInDate: hotel.checkInDate,
          checkOutDate: hotel.checkOutDate,
        },
      });
    }
  };

  return (
    <DropdownWrapper isOpen={isOpen}>
      <div className="w-[380px] bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-5">
        {/* View Toggle */}
        <div className="flex mb-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-xl p-1">
          {(["upcoming", "past"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-1 text-sm rounded-lg transition ${
                viewMode === mode ? "bg-white shadow-lg font-semibold" : "text-gray-500"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <Calendar
          value={selectedDate}
          onChange={(v) => v instanceof Date && setSelectedDate(v)}
          className="rounded-xl shadow-inner border-0"
          tileContent={({ date }) =>
            bookedDates.has(date.toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" })) && (
              <div className="flex justify-center mt-1">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-lg" />
              </div>
            )
          }
        />

        {/* Booking List */}
        <div className="relative mt-4 max-h-[280px] overflow-y-auto space-y-3 scrollbar-none">
          {groupedBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center">No bookings for this day.</p>
          ) : (
            groupedBookings.map((hotel) => (
              <button
                key={hotel.hotelId}
                onClick={() =>
                  navigate("/bookings", {
                    state: {
                      bookingIds: hotel.bookingIds,
                      hotelName: hotel.hotelName,
                      checkInDate: hotel.checkInDate,
                      checkOutDate: hotel.checkOutDate,
                    },
                  })
                }
                onKeyDown={(e) => handleKeyPress(e, hotel.hotelId, hotel)}
                className="w-full text-left p-3 bg-gradient-to-r from-white via-purple-50 to-white rounded-xl hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <p className="font-semibold text-sm text-purple-700">{hotel.hotelName}</p>
                <div className="text-xs text-gray-500">
                  {hotel.rooms.map((room, idx) => (
                    <div key={idx} className="mb-1">
                      {Object.entries(room.statusCounts).map(([status, count], i) => {
                        let colorClass = "";
                        switch (status.toLowerCase()) {
                          case "confirmed":
                            colorClass = "text-green-600 font-semibold";
                            break;
                          case "pending":
                            colorClass = "text-yellow-600 font-semibold";
                            break;
                          case "cancelled":
                            colorClass = "text-red-600 font-semibold";
                            break;
                        }
                        return (
                          <span key={status}>
                            {i > 0 && ", "}
                            <span className={colorClass}>
                              {count} x {room.roomType} ({status.toLowerCase()})
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Dates:{" "}
                  {new Date(hotel.checkInDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} →{" "}
                  {new Date(hotel.checkOutDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </p>
              </button>
            ))
          )}

          {/* Bottom fade overlay */}
          {groupedBookings.length > 2 && (
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white/95 to-transparent" />
          )}
        </div>
      </div>
    </DropdownWrapper>
  );
}