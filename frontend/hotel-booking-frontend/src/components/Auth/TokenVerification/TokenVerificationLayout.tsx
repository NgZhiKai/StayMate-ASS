import React from "react";
import AuthCardLayout from "../AuthCardLayout";

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
    <AuthCardLayout
      title={status === "loading" ? "Verifying..." : title}
      status={status}
      message={
        status === "loading"
          ? "Please wait while we verify your token..."
          : message || "Enter the token sent to your email."
      }
    >
      {email && (
        <p className="text-gray-600 mb-4">
          For: <span className="font-semibold">{email}</span>
        </p>
      )}

      {children}
    </AuthCardLayout>
  );
};

export default TokenVerificationLayout;