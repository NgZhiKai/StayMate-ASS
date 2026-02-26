import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Destination } from "../../types/Hotels";
import { GradientButton } from "../Button";

interface SearchBarProps {
  destinations: Destination[];
  value: string;
  onChange: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  onSearch: () => void;
  placeholder?: string;
  buttonLabel?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  destinations,
  value,
  onChange,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onSearch,
  placeholder = "Where are you going?",
  buttonLabel = "Search",
}) => {
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const destRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  /* =========================
     TIMEZONE SAFE TODAY (SG)
  ========================== */
  const getTodaySG = () => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" })
    );
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const today = getTodaySG();

  /* =========================
     OUTSIDE CLICK HANDLER
  ========================== */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!destRef.current?.contains(event.target as Node))
        setIsDestOpen(false);

      if (!calendarRef.current?.contains(event.target as Node))
        setIsCalendarOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     FORMAT HELPERS
  ========================== */
  const formatLocalDate = (date: Date) => {
    const sgDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Singapore" })
    );

    const year = sgDate.getFullYear();
    const month = String(sgDate.getMonth() + 1).padStart(2, "0");
    const day = String(sgDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("en-SG", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(new Date(dateString));
  };

  const displayDateRange =
    checkIn && checkOut
      ? `${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}`
      : "Check-in Date - Check-out Date";

  /* =========================
     DESTINATION SELECT
  ========================== */
  const handleSelectDestination = (
    dest: Destination,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onChange(`${dest.city}|${dest.country}`);
    setIsDestOpen(false);
  };

  /* =========================
     DATE CHANGE HANDLER
  ========================== */
  const handleDateChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (!selection.startDate) return;

    const start = selection.startDate;
    const end = selection.endDate;

    // Only start selected
    if (!end || start.getTime() === end.getTime()) {
      setCheckIn(formatLocalDate(start));
      setCheckOut("");
      return;
    }

    // Prevent same-day checkout
    if (end <= start) return;

    setCheckIn(formatLocalDate(start));
    setCheckOut(formatLocalDate(end));
    setIsCalendarOpen(false);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 relative items-center">
      {/* =========================
          DESTINATION INPUT
      ========================== */}
      <div
        ref={destRef}
        onClick={() => setIsDestOpen((prev) => !prev)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-full cursor-pointer bg-white shadow-sm hover:shadow-md transition flex items-center justify-between relative"
      >
        <span
          className={`${
            !value ? "text-gray-400" : "text-gray-900 font-medium"
          } truncate`}
        >
          {!value ? placeholder : value.split("|")[0]}
        </span>

        {isDestOpen && (
          <div className="absolute top-full left-0 mt-2 w-full z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-none">
            {destinations.map((dest) => (
              <div
                key={`${dest.city}-${dest.country}`}
                onClick={(e) => handleSelectDestination(dest, e)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm">
                  📍
                </div>
                <div>
                  <div className="font-medium">{dest.city}</div>
                  <div className="text-sm text-gray-500">
                    {dest.country}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================
          DATE RANGE INPUT
      ========================== */}
      <div ref={calendarRef} className="flex-1 relative">
        <div
          onClick={() => setIsCalendarOpen((prev) => !prev)}
          className="w-full px-4 py-3 border border-gray-300 rounded-full cursor-pointer bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
        >
          <span
            className={`${
              checkIn && checkOut
                ? "text-gray-900 font-medium"
                : "text-gray-400"
            }`}
          >
            {displayDateRange}
          </span>
        </div>

        {/* Animated Calendar */}
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 
          transition-all duration-300 ease-out
          ${
            isCalendarOpen
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          <div className="bg-white shadow-2xl rounded-2xl p-4">
            <DateRangePicker
              editableDateInputs
              moveRangeOnFirstSelection
              months={2}
              direction="horizontal"
              minDate={today}
              ranges={[
                {
                  startDate: checkIn
                    ? new Date(checkIn)
                    : today,
                  endDate: checkOut
                    ? new Date(checkOut)
                    : today,
                  key: "selection",
                },
              ]}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      {/* =========================
          SEARCH BUTTON
      ========================== */}
      <GradientButton
        onClick={onSearch}
        className="px-6 py-3 rounded-full shadow-lg flex justify-center items-center
             bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
             text-white font-semibold transition transform duration-200
             hover:scale-105 hover:shadow-xl"
      >
        {buttonLabel}
      </GradientButton>
    </div>
  );
};

export default SearchBar;