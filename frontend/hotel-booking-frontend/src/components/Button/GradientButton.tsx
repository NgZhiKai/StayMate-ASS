// components/Button/GradientButton.tsx
import React from "react";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, loading, ...props }) => (
  <button
    {...props}
    className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold shadow-lg transform transition ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
    }`}
  >
    {loading ? "Sending..." : children}
  </button>
);

export default GradientButton;