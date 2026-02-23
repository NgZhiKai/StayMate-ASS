// components/Button/GradientButton.tsx
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  gradient?: string; // tailwind gradient classes
}

const GradientButton: React.FC<GradientButtonProps> = ({
  loading = false,
  gradient = "from-indigo-500 via-purple-500 to-pink-500",
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`bg-gradient-to-r ${gradient} text-white font-semibold rounded-xl shadow-lg flex justify-center items-center ${className} ${
        loading ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      {loading ? <ClipLoader size={20} color="#ffffff" /> : children}
    </button>
  );
};

export default GradientButton;