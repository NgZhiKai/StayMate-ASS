import React from "react";
import BrandingPanel from "../BrandingPanel";
import { SuccessModal } from "../../Modal";

interface RegisterPageLayoutProps {
  children: React.ReactNode;
  success: boolean;
  closeSuccess: () => void;
}

const RegisterPageLayout: React.FC<RegisterPageLayoutProps> = ({ children, success, closeSuccess }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 select-none">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2">
          <BrandingPanel
            title="Welcome to StayMate"
            subtitle="Book smarter. Stay better. Your perfect stay starts here."
            gradient="from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center p-10 bg-white rounded-tr-3xl rounded-br-3xl">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      <SuccessModal isOpen={success} message="Registration Successful!" onClose={closeSuccess} duration={2000} />
    </div>
  );
};

export default RegisterPageLayout;