import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useSearchPage = (
  initialCity: string,
  initialCountry: string,
  initialCheckIn = "",
  initialCheckOut = ""
) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(`${initialCity}|${initialCountry}`);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  const toggleLayout = () => setLayout(layout === "grid" ? "list" : "grid");

  useEffect(() => {
    if (!searchInput) return;

    const [city, country] = searchInput.split("|");

    navigate(
      `/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(
        country
      )}&checkIn=${checkIn}&checkOut=${checkOut}`,
      { replace: true } // prevents history spam
    );
  }, [checkIn, checkOut]);

  const handleSearch = () => {
    if (!searchInput) return;
    const [city, country] = searchInput.split("|");
    navigate(
      `/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(
        country
      )}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  };

  return { searchInput, setSearchInput, layout, toggleLayout, handleSearch, checkIn, setCheckIn, checkOut, setCheckOut };
};