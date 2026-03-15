import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturedHotels, TrendingDestinations, WhyStaymate } from "../../components/Home";
import { HeroSection } from "../../components/Misc";
import SearchLayout from "../../components/Search/SearchLayout";
import { useDestinations, useScrollReveal } from "../../hooks";

const HomePage: React.FC = () => {
  const { destinations, loading } = useDestinations();
  const [selectedDestination, setSelectedDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const navigate = useNavigate();

  useScrollReveal();

  const handleSearch = () => {
    if (!selectedDestination) return;
    const [city, country] = selectedDestination.split("|");
    navigate(
      `search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&checkIn=${checkIn}&checkOut=${checkOut}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 select-none">
      <HeroSection
        title="Stay smarter with StayMate"
        highlight="stay"
        description="Compare top hotels, find deals, and book in minutes."
        padding="lg"
        align="left"
      />
      <SearchLayout
        destinations={destinations}
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        onSearch={handleSearch}
      />
      <TrendingDestinations destinations={destinations} loading={loading} />
      <FeaturedHotels />
      <WhyStaymate />
    </div>
  );
};

export default HomePage;
