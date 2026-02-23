import React from "react";
import AuthCardLayout from "../AuthCardLayout";

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
    <AuthCardLayout
      title="Reset Password"
      status={status}
      message={message}
    >
      {children}

      {status === "success" && (
        <p className="text-gray-500 mt-4 text-sm">
          Redirecting to <span className="font-semibold">login page</span>...
        </p>
      )}
    </AuthCardLayout>
  );
};

export default ResetPasswordLayout;