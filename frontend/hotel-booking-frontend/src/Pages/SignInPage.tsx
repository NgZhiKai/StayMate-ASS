import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initiateRegistration } from "../services/userApi";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const data = await initiateRegistration(email);
      navigate("/verify", { state: { email, message: data.message } });
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 select-none">
      {/* select-none applied here */}
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Sign in or create an account</h1>
        <p className="text-gray-500 mb-8">
          You can sign in using your StayMate account to access our services.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <label className="absolute left-4 top-2.5 text-gray-400 text-sm transition-all duration-200
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
              peer-focus:top-2.5 peer-focus:text-blue-500 peer-focus:text-sm">
              Email address
            </label>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg transform transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {loading ? "Sending..." : "Continue with email"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </div>
      </div>
    </div>
  );
}