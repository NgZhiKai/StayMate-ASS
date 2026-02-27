import React from "react";
import { motion } from "framer-motion";

interface BrandingPanelProps {
  title?: string;
  subtitle?: string;
  gradient?: string;
  icon?: React.ReactNode; // optional illustration or icon
}

const BrandingPanel: React.FC<BrandingPanelProps> = ({
  title,
  subtitle,
  gradient = "from-indigo-500 via-purple-500 to-pink-500",
  icon,
}) => {
  return (
    <div
      className={`relative flex flex-col justify-center items-center text-white w-full h-full p-10 bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      {/* Animated background circles */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-2xl animate-pulse"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Optional icon / illustration */}
      {icon && <div className="mb-6">{icon}</div>}

      {/* Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {title}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-center opacity-90 max-w-xs md:max-w-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {subtitle}
      </motion.p>

      {/* Decorative bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default BrandingPanel;