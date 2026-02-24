import React from "react";
import SearchBar from "./SearchBar";
import { Destination } from "../../types/Hotels";

interface SearchCardProps {
  destinations: Destination[];
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSearch: () => void;
  className?: string;
}

const SearchResult: React.FC<SearchCardProps> = ({
  destinations,
  searchInput,
  setSearchInput,
  onSearch,
}) => (
  <div className="max-w-5xl mx-auto px-6 relative -translate-y-28 z-50">
    <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.12)] p-8">
      <SearchBar
        destinations={destinations}
        value={searchInput}
        onChange={setSearchInput}
        onSearch={onSearch}
      />
    </div>
  </div>
);

export default SearchResult;