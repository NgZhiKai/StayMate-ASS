import React from "react";

interface AuthCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => (
  <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30 text-center select-none">
    {/* Optional Logo */}
    <div className="flex justify-center mb-6">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl tracking-wide shadow-lg">
        SM
      </div>
    </div>

    {title && <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">{title}</h1>}
    {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

    {children}
  </div>
);

export default AuthCard;