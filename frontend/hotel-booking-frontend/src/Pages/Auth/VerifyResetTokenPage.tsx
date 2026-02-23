import React from "react";
import { userApi } from "../../services/User";
import TokenVerificationPage from "./TokenVerificationPage";

const VerifyResetTokenPage: React.FC<{ email?: string }> = ({ email }) => {
  return (
    <TokenVerificationPage
      title="Verify Reset Token"
      verifyFunction={userApi.verifyUser}
      successRedirect="/reset-password"
      successMessage="Token verified! Redirecting to reset password..."
      email={email}
    />
  );
};

export default VerifyResetTokenPage;