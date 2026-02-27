import React, { ReactNode } from "react";

interface HeroSectionProps {
  title: string;
  highlight?: string;
  description?: string;
  icon?: ReactNode;
  align?: "center" | "left";
  gradient?: string;
  highlightGradient?: string;
  padding?: "sm" | "md" | "lg";
  children?: ReactNode;
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  highlight,
  description,
  icon,
  align = "center",
  gradient = "from-[#667eea] via-[#770265] to-[#f093fb]",
  highlightGradient = "from-yellow-300 via-pink-300 to-orange-300",
  padding = "md",
  children,
  className = "",
}) => {
  const paddingMap = {
    sm: "pt-24 pb-20",
    md: "pt-28 pb-28",
    lg: "pt-32 pb-40",
  };

  const isLeft = align === "left";

  const renderTitle = () => {
    if (!highlight) return title;

    const parts = title.split(highlight);

    return (
      <>
        {parts[0]}
        <span
          className={`bg-gradient-to-r ${highlightGradient} bg-clip-text text-transparent`}
        >
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white px-6 ${paddingMap[padding]} ${className}`}
    >
      {/* Grid overlay (premium SaaS look) */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-3xl" />

      <div
        className={`relative max-w-6xl ${
          isLeft ? "mx-0 text-left" : "mx-auto text-center"
        }`}
      >
        {/* Optional accent line (Stripe-style) */}
        {isLeft && (
          <div className="w-16 h-1 bg-white/80 mb-6 rounded-full" />
        )}

        {icon && (
          <div
            className={`mb-4 ${
              isLeft ? "flex justify-start" : "flex justify-center"
            }`}
          >
            {icon}
          </div>
        )}

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          {renderTitle()}
        </h1>

        {description && (
          <p
            className={`text-lg sm:text-xl opacity-90 max-w-2xl ${
              isLeft ? "" : "mx-auto"
            }`}
          >
            {description}
          </p>
        )}

        {children && (
          <div
            className={`mt-8 ${
              isLeft ? "flex justify-start" : "flex justify-center"
            }`}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;