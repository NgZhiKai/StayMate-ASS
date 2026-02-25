import React from "react";
import { InputField, SelectField } from "../../components/Form";

interface HotelFiltersProps {
  filters: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ratingOptions = [
  { value: "", label: "Any" },
  { value: "1", label: "★ 1" },
  { value: "2", label: "★★ 2" },
  { value: "3", label: "★★★ 3" },
  { value: "4", label: "★★★★ 4" },
  { value: "5", label: "★★★★★ 5" },
];

const HotelFilters: React.FC<HotelFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex flex-col select-none h-full">
      {/* Scrollable inputs */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto scrollbar-none">
        {/* Price Filters */}
        <InputField
          label="Min Price"
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={onChange}
          placeholder="0"
          className="w-full py-2 px-3 text-sm"
        />
        <InputField
          label="Max Price"
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={onChange}
          placeholder="1000"
          className="w-full py-2 px-3 text-sm"
        />

        {/* Rating Filters */}
        <SelectField
          label="Min Rating"
          name="minRating"
          value={filters.minRating}
          onChange={onChange}
          options={ratingOptions}
          className="w-full py-2 px-3 text-sm"
        />
        <SelectField
          label="Max Rating"
          name="maxRating"
          value={filters.maxRating}
          onChange={onChange}
          options={ratingOptions}
          className="w-full py-2 px-3 text-sm"
        />
      </div>
    </div>
  );
};

export default HotelFilters;