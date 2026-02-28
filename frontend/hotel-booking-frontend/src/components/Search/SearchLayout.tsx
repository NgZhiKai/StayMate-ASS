import React from "react";
import { Destination } from "../../types/Hotels";
import SearchBar from "./SearchBar";

interface SearchLayoutProps {
  destinations: Destination[];
  selectedDestination: string;
  setSelectedDestination: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  onSearch: () => void;
}

const SearchLayout: React.FC<SearchLayoutProps> = ({
  destinations,
  selectedDestination,
  setSelectedDestination,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onSearch,
}) => (
  <div className="max-w-5xl mx-auto px-6 relative -translate-y-28 z-50">
    <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.12)] p-8">
      <SearchBar
        destinations={destinations}
        value={selectedDestination}
        onChange={setSelectedDestination}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        onSearch={onSearch}
        placeholder="Where are you going?"
        buttonLabel="Search"
      />
    </div>
  </div>
);

export default SearchLayout;