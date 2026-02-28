import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/User";

export const useSignIn = (initialEmail: string = "") => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e?: { preventDefault: () => void }) => {
    e?.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return setError("Please enter your email address.");
    if (!emailRegex.test(email)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      const data = await userApi.initiateRegistration(email);
      navigate("/verify", { state: { email, message: data.message } });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, error, loading, handleSubmit };
};
