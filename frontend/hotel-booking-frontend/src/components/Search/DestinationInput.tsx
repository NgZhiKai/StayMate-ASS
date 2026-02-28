import React, { useEffect, useRef, useState } from "react";
import { Destination } from "../../types/Hotels";

interface DestinationInputProps {
  value: string;
  onChange: (val: string) => void;
  destinations: Destination[];
  placeholder?: string;
}

export const DestinationInput: React.FC<DestinationInputProps> = ({
  value,
  onChange,
  destinations,
  placeholder = "Where are you going?",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasValue = value.length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dest: Destination) => {
    onChange(`${dest.city}|${dest.country}`);
    setIsOpen(false);
  };

  return (
    <div
      ref={ref}
      className="flex-1 relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 border border-gray-300 rounded-full cursor-pointer bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
        aria-expanded={isOpen}
        aria-controls="destination-dropdown"
      >
        <span className={`${hasValue ? "text-gray-900 font-medium" : "text-gray-400"} truncate`}>
          {hasValue ? value.split("|")[0] : placeholder}
        </span>
      </button>

      {isOpen && (
        <div
          id="destination-dropdown"
          className="absolute top-full left-0 mt-2 w-full z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-none"
        >
          {destinations.map((dest) => (
            <button
              type="button"
              key={`${dest.city}-${dest.country}`}
              onClick={() => handleSelect(dest)}
              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm">📍</div>
              <div>
                <div className="font-medium">{dest.city}</div>
                <div className="text-sm text-gray-500">{dest.country}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
