import React from "react";
import LoginForm from "./LoginForm";
import BrandingPanel from "../BrandingPanel";
import { ForgotPasswordModal } from "../../Modal";
import { LoginData } from "../../../types/User";

interface LoginPageLayoutProps {
  loginData: LoginData;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (data: LoginData) => void;
  handleForgotPassword: () => void;
  isForgotOpen: boolean;
  setIsForgotOpen: (open: boolean) => void;
  modalMessage: string;
  modalType: "success" | "error";
  isLoading: boolean;
  setLoginData: (data: LoginData) => void;
}

const LoginPageLayout: React.FC<LoginPageLayoutProps> = ({
  loginData,
  handleLoginChange,
  handleLogin,
  handleForgotPassword,
  isForgotOpen,
  setIsForgotOpen,
  modalMessage,
  modalType,
  isLoading,
  setLoginData,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 select-none">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:flex md:w-1/2">
          <BrandingPanel
            title="Welcome Back to StayMate"
            subtitle="Book smarter. Stay better. Your perfect stay starts here."
            gradient="from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center p-10 bg-white rounded-tr-3xl rounded-br-3xl">
          <div className="w-full max-w-md">
            <LoginForm
              loginData={loginData}
              onLogin={handleLogin}
              handleChange={handleLoginChange}
              isLoading={isLoading}
              isEmailReadonly={false}
              onForgotClick={() => setIsForgotOpen(true)}
            />

            <ForgotPasswordModal
              isOpen={isForgotOpen}
              onClose={() => setIsForgotOpen(false)}
              email={loginData.email}
              setEmail={(email) => setLoginData({ ...loginData, email })}
              isLoading={isLoading}
              modalMessage={modalMessage}
              modalType={modalType}
              onSend={handleForgotPassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageLayout;