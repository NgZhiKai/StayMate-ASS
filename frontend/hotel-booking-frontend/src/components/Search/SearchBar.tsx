import React from "react";
import { Destination } from "../../types/Hotels";
import { GradientButton } from "../Button";
import { DateRangeInput } from "./DateRangeInput";
import { DestinationInput } from "./DestinationInput";

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

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { destinations, value, onChange, checkIn, setCheckIn, checkOut, setCheckOut, onSearch, placeholder, buttonLabel } = props;

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 relative items-center">
      <DestinationInput value={value} onChange={onChange} destinations={destinations} placeholder={placeholder} />
      <DateRangeInput checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} />
      <GradientButton
        onClick={onSearch}
        className="px-6 py-3 rounded-full shadow-lg flex justify-center items-center
             bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500
             text-white font-semibold transition transform duration-200
             hover:scale-105 hover:shadow-xl"
      >
        {buttonLabel || "Search"}
      </GradientButton>
    </div>
  );
};

export default SearchBar;