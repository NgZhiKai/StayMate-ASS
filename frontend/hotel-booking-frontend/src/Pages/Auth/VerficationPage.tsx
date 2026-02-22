import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyUser } from "../../services/User/userApi";

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
      setMessage(
        error.message || "Verification failed. The token may be invalid or expired."
      );
    }
  };

  let headingText = "Email Verification";
  let headingColor = "text-gray-800";

  if (status === "loading") {
    headingText = "Verifying...";
  } else if (status === "success") {
    headingText = "Success!";
    headingColor = "text-green-600";
  } else if (status === "error") {
    headingText = "Verification Failed";
    headingColor = "text-red-600";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md text-center select-none">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl tracking-wide shadow-lg">
            SM
          </div>
        </div>

        {/* Heading */}
        <h1
          className={`text-2xl sm:text-3xl font-bold mb-4 transition-colors ${headingColor}`}
        >
          {headingText}
        </h1>

        {/* Message */}
        <p
          className={`text-gray-700 mb-6 ${
            status === "success" || status === "error" ? "font-medium" : ""
          }`}
        >
          {status === "loading"
            ? "Please wait while we verify your email..."
            : message || "Enter your verification token below."}
        </p>

        {/* Input + Button */}
        {status !== "loading" && (
          <>
            <input
              type="text"
              placeholder="Enter your token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 transition"
            />
            <button
              onClick={handleVerify}
              disabled={!tokenInput.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transform transition-all ${
                tokenInput.trim()
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Verify Email
            </button>
          </>
        )}

        {/* Optional redirect message */}
        {status === "success" && (
          <p className="text-gray-500 mt-4 text-sm">
            Redirecting to <span className="font-semibold">login page</span>...
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;