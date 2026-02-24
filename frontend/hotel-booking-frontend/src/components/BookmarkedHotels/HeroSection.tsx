import React from "react";

const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#6b5b95] via-[#b57edc] to-[#f093fb] text-white pt-28 pb-40 px-6">
    {/* Background blobs */}
    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-pink-400/30 rounded-full blur-3xl" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/30 rounded-full blur-3xl" />

    <div className="relative max-w-7xl mx-auto text-center">
      <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
        Your{" "}
        <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-[length:300%_300%] bg-clip-text text-transparent animate-gradient">
          favorite stays
        </span>
      </h1>
      <p className="text-xl sm:text-2xl font-light opacity-90 max-w-2xl mx-auto">
        All your bookmarked hotels and cozy escapes in one place.
      </p>
    </div>
  </section>
);

export default HeroSection;