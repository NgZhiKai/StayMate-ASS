import React from "react";

const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] text-white pt-28 pb-20 px-6">
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
        Manage All <span className="text-yellow-300">Bookings</span>
      </h1>
      <p className="text-lg sm:text-xl font-light opacity-90 max-w-2xl mx-auto">
        View all bookings made on your platform and manage them efficiently.
      </p>
    </div>
  </section>
);

export default HeroSection;