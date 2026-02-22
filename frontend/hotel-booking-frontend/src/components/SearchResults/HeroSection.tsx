import React from "react";

interface HeroSectionProps {
  city: string;
  country: string;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ city, country }) => (
  <div className="relative overflow-hidden pb-32 pt-24 px-6">
    
    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 animate-gradient-x z-0" />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/20 z-10" />

    {/* Content */}
    <div className="relative z-20 max-w-7xl mx-auto text-white">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
        Hotels in {city || country}
      </h1>
      <p className="text-lg md:text-xl opacity-90">
        Find the perfect stay for your trip.
      </p>
    </div>
  </div>
);

export default HeroSection;