import React, { useRef, useState, useEffect } from "react";
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dest: Destination, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(`${dest.city}|${dest.country}`);
    setIsOpen(false);
  };

  return (
    <div
      ref={ref}
      onClick={() => setIsOpen((prev) => !prev)}
      className="flex-1 px-4 py-3 border border-gray-300 rounded-full cursor-pointer bg-white shadow-sm hover:shadow-md transition flex items-center justify-between relative"
    >
      <span className={`${!value ? "text-gray-400" : "text-gray-900 font-medium"} truncate`}>
        {!value ? placeholder : value.split("|")[0]}
      </span>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto scrollbar-none">
          {destinations.map((dest) => (
            <div
              key={`${dest.city}-${dest.country}`}
              onClick={(e) => handleSelect(dest, e)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm">📍</div>
              <div>
                <div className="font-medium">{dest.city}</div>
                <div className="text-sm text-gray-500">{dest.country}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};