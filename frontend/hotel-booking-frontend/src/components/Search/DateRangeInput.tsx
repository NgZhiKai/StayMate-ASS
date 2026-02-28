import React, { useEffect, useRef, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangeInputProps {
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
}

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const getTodaySG = () => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
    now.setHours(0, 0, 0, 0);
    return now;
  };
  const today = getTodaySG();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatLocalDate = (date: Date) => {
    const sgDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
    return `${sgDate.getFullYear()}-${String(sgDate.getMonth() + 1).padStart(2, "0")}-${String(
      sgDate.getDate()
    ).padStart(2, "0")}`;
  };

  const formatDisplayDate = (dateString: string) =>
    dateString
      ? new Intl.DateTimeFormat("en-SG", { weekday: "short", day: "2-digit", month: "short" }).format(
          new Date(dateString)
        )
      : "";

  const displayDateRange =
    checkIn && checkOut ? `${formatDisplayDate(checkIn)} - ${formatDisplayDate(checkOut)}` : "Check-in Date - Check-out Date";

  const handleDateChange = (ranges: RangeKeyDict) => {
    const selection = ranges.selection;
    if (!selection.startDate) return;
    const start = selection.startDate;
    const end = selection.endDate;

    if (!end || start.getTime() === end.getTime()) {
      setCheckIn(formatLocalDate(start));
      setCheckOut("");
      return;
    }

    if (end <= start) return;

    setCheckIn(formatLocalDate(start));
    setCheckOut(formatLocalDate(end));
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="flex-1 relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 border border-gray-300 rounded-full cursor-pointer bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
        aria-expanded={isOpen}
        aria-controls="date-range-picker-panel"
      >
        <span className={`${checkIn && checkOut ? "text-gray-900 font-medium" : "text-gray-400"}`}>
          {displayDateRange}
        </span>
      </button>

      <div
        id="date-range-picker-panel"
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 z-50 transition-all duration-300 ease-out ${
          isOpen ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
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
              { startDate: checkIn ? new Date(checkIn) : today, endDate: checkOut ? new Date(checkOut) : today, key: "selection" },
            ]}
            onChange={handleDateChange}
          />
        </div>
      </div>
    </div>
  );
};
