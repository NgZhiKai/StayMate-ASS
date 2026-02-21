// src/components/User/LoginForm.tsx
import React, { useEffect, useState } from "react";
import { LoginData } from "../../types/User";
import MessageModal from "../Modal/MessageModal";

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
    <div className="w-full bg-white rounded-2xl p-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Welcome Back 👋</h2>

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
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={loginData.email}
          onChange={handleChange}
          readOnly={isEmailReadonly}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
            isEmailReadonly ? "bg-gray-100 cursor-not-allowed" : ""
          }`} 
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;