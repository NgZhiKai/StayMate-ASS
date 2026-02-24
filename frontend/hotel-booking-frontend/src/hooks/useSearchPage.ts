import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSearchPage = (initialCity: string, initialCountry: string) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(`${initialCity}|${initialCountry}`);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const toggleLayout = () => setLayout(layout === "grid" ? "list" : "grid");

  const handleSearch = () => {
    if (!searchInput) return;
    const [city, country] = searchInput.split("|");
    navigate(`/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
  };

  return { searchInput, setSearchInput, layout, toggleLayout, handleSearch };
};