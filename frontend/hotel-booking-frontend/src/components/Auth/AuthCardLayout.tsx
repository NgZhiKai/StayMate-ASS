import React from "react";

interface AuthCardLayoutProps {
  title: string;
  status?: "idle" | "loading" | "success" | "error";
  message?: string;
  children: React.ReactNode;
}

const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
  title,
  status = "idle",
  message,
  children,
}) => {
  const headingColor =
    status === "error"
      ? "text-red-600"
      : status === "success"
      ? "text-green-600"
      : "text-gray-800";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-lg text-center select-none transition-all duration-300">
        
        {/* Logo + Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
            SM
          </div>
          <span className="text-3xl font-semibold text-gray-800 font-serif italic tracking-wide">
            Staymate
          </span>
        </div>

        {/* Title */}
        <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${headingColor}`}>
          {title}
        </h1>

        {/* Message */}
        {message && (
          <p className="text-gray-700 mb-6 font-medium">
            {message}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};

export default AuthCardLayout;