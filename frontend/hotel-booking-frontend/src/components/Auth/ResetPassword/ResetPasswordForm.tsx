import React from "react";
import { GradientButton } from "../../Button";
import { InputField } from "../../Form";

interface ResetPasswordFormProps {
  password: string;
  confirmPassword: string;
  setPassword: (val: string) => void;
  setConfirmPassword: (val: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <InputField
        label="New Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <GradientButton
        type="submit"
        disabled={!password || !confirmPassword || isLoading}
        className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </GradientButton>
    </form>
  );
};

export default ResetPasswordForm;