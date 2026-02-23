import React from "react";
import { GradientButton } from "../../Button";
import { InputField } from "../../Form";

interface SignInFormProps {
  email: string;
  setEmail: (val: string) => void;
  error?: string;
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  error,
  loading,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
      autoComplete="off"
    >
      {/* Email Input */}
      <InputField
        label="Email address"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />

      {/* Error Message */}
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      {/* Gradient Button */}
      <GradientButton
        type="submit"
        loading={loading}
        className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      >
        {loading ? "Processing..." : "Continue with Email"}
      </GradientButton>
    </form>
  );
};

export default SignInForm;