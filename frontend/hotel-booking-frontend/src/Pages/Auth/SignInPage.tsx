// pages/Auth/SignInPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initiateRegistration } from "../../services/User/userApi";

import SignInForm from "../../components/Auth/SignInForm";
import LegalLinks from "../../components/Legal/LegalLinks";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return setError("Please enter your email address.");
    if (!emailRegex.test(email)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      const data = await initiateRegistration(email);
      navigate("/verify", { state: { email, message: data.message } });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 select-none">
      <div className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/30">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Sign in or create an account</h1>
        <p className="text-gray-500 mb-8 text-sm">Use your StayMate account to access our services seamlessly.</p>

        <SignInForm email={email} setEmail={setEmail} error={error} loading={loading} onSubmit={handleSubmit} />

        <LegalLinks />
      </div>
    </div>
  );
}