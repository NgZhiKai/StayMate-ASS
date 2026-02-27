import { useState } from "react";

export interface Filters {
  minPrice: string;
  maxPrice: string;
  minRating: string;
  maxRating: string;
}

export const useHotelFilters = (initialFilters?: Partial<Filters>) => {
  const [filters, setFilters] = useState<Filters>({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    maxRating: "",
    ...initialFilters,
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return { filters, setFilters, handleFilterChange };
};