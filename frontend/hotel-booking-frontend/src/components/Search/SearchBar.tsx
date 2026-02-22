import React, { useState, useRef, useEffect } from "react";

interface Destination {
  city: string;
  country: string;
}

interface SearchBarProps {
  destinations: Destination[];
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  destinations = [],
  value,
  onChange,
  onSearch,
  placeholder = "Select a destination",
  buttonLabel = "Search",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (dest: Destination) => {
    const val = `${dest.city}|${dest.country}`;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="w-full relative flex gap-3">
      {/* Input */}
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl cursor-pointer flex items-center justify-between bg-white shadow-sm hover:shadow-md transition duration-200"
      >
        <span className={`${!value ? "text-gray-400" : "text-gray-900 font-medium"} truncate`}>
          {!value ? placeholder : value.split("|")[0]}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Search Button */}
      <button
        onClick={onSearch}
        className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold rounded-2xl shadow-md hover:opacity-90 transition duration-200"
      >
        {buttonLabel}
      </button>

      {/* Dropdown */}
      {isOpen && (destinations || []).length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full z-50 bg-white border border-gray-200 rounded-2xl max-h-60 overflow-y-auto shadow-2xl">
          {(destinations || []).map((dest) => (
            <div
              key={`${dest.city}-${dest.country}`}
              onClick={() => handleSelect(dest)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 transition"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                📍
              </div>
              <div className="truncate">
                <div className="font-medium text-gray-900">{dest.city}</div>
                <div className="text-sm text-gray-500">{dest.country}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;