import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser } from "../../services/User/userApi";

import AuthCard from "../../components/Auth/AuthCard";
import GradientButton from "../../components/Button/GradientButton";
import InputField from "../../components/Form/InputField";

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; message?: string } | undefined;

  const [tokenInput, setTokenInput] = useState("");
  const [message, setMessage] = useState<string>(state?.message || "");
  type VerificationStatus = "idle" | "loading" | "success" | "error";
  const [status, setStatus] = useState<VerificationStatus>("idle");

  const handleVerify = async () => {
    if (!tokenInput.trim()) {
      setStatus("error");
      setMessage("Please enter a valid verification token.");
      return;
    }

    try {
      setStatus("loading");
      const response = await verifyUser(tokenInput);

      setStatus("success");
      if (response.tokenType === "EXISTING_USER") {
        setMessage("Welcome back! Redirecting to login...");
        setTimeout(() => navigate("/login", { state: { userId: response.userId } }), 4000);
      } else {
        setMessage("Thank you for registering! Redirecting to complete your profile...");
        setTimeout(() => navigate("/register", { state: { userId: response.userId } }), 4000);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Verification failed. The token may be invalid or expired.");
    }
  };

  const getHeading = () => {
    if (status === "loading") return { text: "Verifying...", color: "text-gray-800" };
    if (status === "success") return { text: "Success!", color: "text-green-600" };
    if (status === "error") return { text: "Verification Failed", color: "text-red-600" };
    return { text: "Email Verification", color: "text-gray-800" };
  };

  const { text: headingText, color: headingColor } = getHeading();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
      <AuthCard title={headingText} subtitle={message}>
        {status !== "loading" && (
          <>
            <InputField
              type="text"
              placeholder="Enter your token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <GradientButton
              onClick={handleVerify}
              disabled={!tokenInput.trim()}
            >
              Verify Email
            </GradientButton>
          </>
        )}

        {status === "loading" && (
          <p className="text-gray-500 mt-2 text-sm">Please wait while we verify your email...</p>
        )}
      </AuthCard>
    </div>
  );
};

export default VerifyEmailPage;