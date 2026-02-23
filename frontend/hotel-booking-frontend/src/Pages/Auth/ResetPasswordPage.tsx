import React from "react";
import { useLocation } from "react-router-dom";
import { ResetPasswordForm, ResetPasswordLayout } from "../../components/Auth/ResetPassword";
import { useResetPassword } from "../../hooks/useResetPassword";

const ResetPasswordPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    status,
    message,
    handleReset,
  } = useResetPassword(token ?? undefined);

  return (
    <ResetPasswordLayout status={status} message={message}>
      {status !== "success" && (
        <ResetPasswordForm
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleReset}
          isLoading={status === "loading"}
        />
      )}
    </ResetPasswordLayout>
  );
};

export default ResetPasswordPage;