import React from "react";
import SearchBar from "../Search/SearchBar";
import { Destination } from "../../hooks/useSearchResults";

interface SearchCardProps {
  destinations: Destination[];
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSearch: () => void;
  className?: string;
}

const SearchCard: React.FC<SearchCardProps> = ({
  destinations,
  searchInput,
  setSearchInput,
  onSearch,
}) => (
  <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
    <div className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 transition transform hover:scale-105">
      <SearchBar
        destinations={destinations}
        value={searchInput}
        onChange={setSearchInput}
        onSearch={onSearch}
        className="w-full focus-within:ring-4 focus-within:ring-pink-400 focus-within:ring-opacity-40 rounded-xl transition duration-300"
      />
    </div>
  </div>
);

export default SearchCard;