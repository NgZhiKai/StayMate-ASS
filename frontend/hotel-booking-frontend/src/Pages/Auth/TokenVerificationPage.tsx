import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenVerificationForm, TokenVerificationLayout } from "../../components/Auth/TokenVerification";

interface TokenVerificationPageProps {
  title: string;
  verifyFunction: (token: string) => Promise<any>;
  successMessage: string;
  successRedirect: string;
  email?: string;
}

const TokenVerificationPage: React.FC<TokenVerificationPageProps> = ({
  title,
  verifyFunction,
  successMessage,
  successRedirect,
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
      const response = await verifyFunction(token.trim());
      const { tokenType, userId } = response;

      setStatus("success");
      setMessage(successMessage);

      setTimeout(() => {
        if (tokenType === "NEW_USER" && successRedirect === "/login") {
          navigate("/register", { state: { userId } });
        } else if (tokenType === "EXISTING_USER" && successRedirect === "/login") {
          navigate(`${successRedirect}`, { state: { userId } });
        } else {
          navigate(`${successRedirect}?token=${token ? encodeURIComponent(token.trim()) : ""}`);
        }
      }, 1500);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Verification failed.");
    }
  };

  return (
    <TokenVerificationLayout
      title={title}
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