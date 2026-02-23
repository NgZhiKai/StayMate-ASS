import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenVerificationForm, TokenVerificationLayout } from "../../components/Auth/TokenVerification";

interface TokenVerificationPageProps {
  title: string;
  verifyFunction: (token: string) => Promise<any>;
  successRedirect: string;
  successMessage: string;
  email?: string;
}

const TokenVerificationPage: React.FC<TokenVerificationPageProps> = ({
  title,
  verifyFunction,
  successRedirect,
  successMessage,
  email,
}) => {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    if (!token.trim()) {
      setStatus("error");
      setMessage("Please enter your token.");
      return;
    }

    try {
      setStatus("loading");
      await verifyFunction(token.trim());

      setStatus("success");
      setMessage(successMessage);

      setTimeout(() => {
        navigate(`${successRedirect}?token=${encodeURIComponent(token.trim())}`);
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Verification failed.");
    }
  };

  return (
    <TokenVerificationLayout
      heading={status === "loading" ? "Verifying..." : title}
      status={status}
      message={
        status === "loading"
          ? "Please wait while we verify your token..."
          : message || "Enter the token sent to your email."
      }
      email={email}
    >
      {status !== "success" && (
        <TokenVerificationForm
          token={token}
          setToken={setToken}
          onVerify={handleVerify}
          isLoading={status === "loading"}
        />
      )}
    </TokenVerificationLayout>
  );
};

export default TokenVerificationPage;