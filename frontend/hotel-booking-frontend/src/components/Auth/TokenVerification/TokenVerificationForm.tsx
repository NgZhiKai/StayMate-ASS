import React from "react";
import { GradientButton } from "../../Button";
import { InputField } from "../../Form";

interface TokenVerificationFormProps {
  token: string;
  setToken: (val: string) => void;
  onVerify: () => void;
  isLoading?: boolean;
}

const TokenVerificationForm: React.FC<TokenVerificationFormProps> = ({
  token,
  setToken,
  onVerify,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      <InputField
        label=""
        type="text"
        name="token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter token"
        required
      />

      <GradientButton
        onClick={onVerify}
        disabled={!token.trim() || isLoading}
        className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      >
        {isLoading ? "Verifying..." : "Verify Token"}
      </GradientButton>
    </div>
  );
};

export default TokenVerificationForm;