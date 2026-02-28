import React from "react";
import BrandingPanel from "../BrandingPanel";

interface TokenVerificationLayoutProps {
  title: string;
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  email?: string;
  children?: React.ReactNode;
}

const TokenVerificationLayout: React.FC<TokenVerificationLayoutProps> = ({
  title,
  status,
  message,
  email,
  children,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 select-none px-4">

      {/* OUTER GLASS CONTAINER */}
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">

        <div className="flex flex-col lg:flex-row">

          {/* LEFT BRANDING PANEL */}
          <div className="hidden lg:block lg:w-1/2">
            <BrandingPanel
              title="Welcome to Staymate"
              subtitle="Secure your account and start booking unforgettable stays."
            />
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="w-full lg:w-1/2 p-10 lg:p-14 bg-white">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {status === "loading" ? "Verifying..." : title}
            </h1>

            <p className="text-gray-500 mb-6">
              {status === "loading"
                ? "Please wait while we verify your token..."
                : message || "Enter the token sent to your email."}
            </p>

            {email && (
              <p className="text-sm text-gray-500 mb-6">
                For: <span className="font-medium text-gray-700">{email}</span>
              </p>
            )}

            {children}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenVerificationLayout;