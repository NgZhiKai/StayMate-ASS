import React from "react";
import { userApi } from "../../services/User";
import TokenVerificationPage from "./TokenVerificationPage";

const VerifyEmailPage: React.FC = () => {
  return (
    <TokenVerificationPage
      title="Verify Email"
      verifyFunction={userApi.verifyUser}
      successRedirect="/login"
      successMessage="Email verified successfully! Redirecting to login..."
    />
  );
};

export default VerifyEmailPage;