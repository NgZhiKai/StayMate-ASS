import React, { ReactNode } from "react";

type HeroProps = {
  title: string;
  highlight?: string; // the part of title with gradient
  description: string;
  icon?: ReactNode; // optional icon to show on top
  gradientColors?: string; // tailwind gradient classes
  className?: string; // extra classes for spacing
};

const HeroSection: React.FC<HeroProps> = ({
  title,
  highlight,
  description,
  icon,
  gradientColors = "from-yellow-300 via-pink-300 to-orange-300",
  className = "",
}) => (
  <section className={`relative overflow-hidden text-white pt-28 pb-32 px-6 ${className}`}>
    {/* Decorative blobs */}
    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl" />
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-600/20 rounded-full blur-3xl" />

    <div className="relative max-w-4xl mx-auto text-center">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}

      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
        {highlight ? (
          <>
            {title.split(highlight)[0]}
            <span className={`bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent animate-gradient`}>
              {highlight}
            </span>
            {title.split(highlight)[1]}
          </>
        ) : (
          title
        )}
      </h1>

      <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">{description}</p>
    </div>
  </section>
);

export default HeroSection;