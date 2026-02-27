import React from "react";
import SignInForm from "./SignInForm";
import { LegalLinks } from "../../Legal";

interface SignInPageLayoutProps {
  email: string;
  setEmail: (value: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e?: React.FormEvent) => void;
}

const SignInPageLayout: React.FC<SignInPageLayoutProps> = ({
  email,
  setEmail,
  error,
  loading,
  onSubmit,
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 select-none">
      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Sign in or create an account
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Use your StayMate account to access our services seamlessly.
        </p>

        <SignInForm
          email={email}
          setEmail={setEmail}
          error={error}
          loading={loading}
          onSubmit={onSubmit}
        />

        <LegalLinks />
      </div>
    </div>
  );
};

export default SignInPageLayout;