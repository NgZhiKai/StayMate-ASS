import React from "react";
import InputField from "../../components/Form/InputField";
import GradientButton from "../Button/GradientButton";

interface SignInFormProps {
  email: string;
  setEmail: (val: string) => void;
  error?: string;
  loading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ email, setEmail, error, loading, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <InputField label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <GradientButton type="submit" loading={loading}>
        Continue with email
      </GradientButton>
    </form>
  );
};

export default SignInForm;