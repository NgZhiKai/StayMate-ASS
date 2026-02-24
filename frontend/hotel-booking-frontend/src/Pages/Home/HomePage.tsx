// pages/HomePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FeaturedHotels, HeroSection, TrendingDestinations, WhyStaymate } from "../../components/Home";
import { SearchHome } from "../../components/Search";
import { useDestinations, useScrollReveal } from "../../hooks";

const HomePage: React.FC = () => {
  const { destinations, loading } = useDestinations();
  const [selectedDestination, setSelectedDestination] = useState("");
  const navigate = useNavigate();

  useScrollReveal();

  const handleSearch = () => {
    if (!selectedDestination) return;
    const [city, country] = selectedDestination.split("|");

    navigate(`search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 select-none">
      <HeroSection />
      <SearchHome
        destinations={destinations}
        selectedDestination={selectedDestination}
        setSelectedDestination={setSelectedDestination}
        onSearch={handleSearch}
      />
      <TrendingDestinations destinations={destinations} loading={loading} />
      <FeaturedHotels destinations={destinations} />
      <WhyStaymate />
    </div>
  );
};

export default HomePage;