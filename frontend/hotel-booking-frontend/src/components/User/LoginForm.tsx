import React, { useEffect, useState } from "react";
import { LoginData } from "../../types/User";
import MessageModal from "../Modal/MessageModal";
import InputField from "../Form/InputField";

interface LoginFormProps {
  loginData: LoginData;
  error: string | null;
  onLogin: (loginData: LoginData) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmailReadonly?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  error,
  onLogin,
  handleChange,
  isEmailReadonly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(!!error);
  }, [error]);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="w-full bg-white rounded-3xl p-10 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Welcome Back 👋</h2>

      {error && (
        <MessageModal
          isOpen={isModalOpen}
          message={error}
          onClose={closeModal}
          type="error"
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(loginData);
        }}
        className="space-y-5"
      >
        <InputField
          label="Email"
          type="email"
          name="email"
          value={loginData.email}
          onChange={handleChange}
          readOnly={isEmailReadonly}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:scale-105 transition-transform duration-300"
        >
          Sign In
        </button>
      </form>

      <div className="mt-6 text-center text-gray-400 text-sm">
        By signing in, you agree to our{" "}
        <a href="/stayMate/terms" className="underline hover:text-gray-700">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/stayMate/privacy" className="underline hover:text-gray-700">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
};

export default LoginForm;