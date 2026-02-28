import React from "react";
import BrandingPanel from "../BrandingPanel";

interface ResetPasswordLayoutProps {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  children?: React.ReactNode;
}

const ResetPasswordLayout: React.FC<ResetPasswordLayoutProps> = ({
  status,
  message,
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
              title="Create a new password"
              subtitle="Keep your Staymate account secure and continue your journey."
            />
          </div>

          {/* RIGHT FORM SECTION */}
          <div className="w-full lg:w-1/2 p-10 lg:p-14 bg-white">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Reset Password
            </h1>

            {message && (
              <p className="text-gray-500 mb-6">
                {message}
              </p>
            )}

            {children}

            {status === "success" && (
              <p className="text-gray-500 mt-6 text-sm">
                Redirecting to <span className="font-semibold">login page</span>...
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLayout;