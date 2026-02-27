import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/User";

export const useResetPassword = (token?: string) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No reset token provided. Please verify your token first.");
    }
  }, [token]);

  const handleReset = async () => {
    if (!password || password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setStatus("loading");
      await userApi.resetPassword(token!, password);

      setStatus("success");
      setMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to reset password.");
    }
  };

  return {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    status,
    message,
    handleReset,
  };
};