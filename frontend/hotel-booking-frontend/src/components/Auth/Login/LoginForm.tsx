import React from "react";
import { LoginData } from "../../../types/User";
import { GradientButton } from "../../Button";
import { InputField } from "../../Form";

interface LoginFormProps {
  loginData: LoginData;
  onLogin: (data: LoginData) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEmailReadonly?: boolean;
  isLoading?: boolean;
  onForgotClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  onLogin,
  handleChange,
  isEmailReadonly = false,
  isLoading = false,
  onForgotClick,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl p-10 shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Welcome Back 👋
      </h2>

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
          placeholder="Enter your email"
          required
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotClick}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <GradientButton
          type="submit"
          loading={isLoading}
          className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          gradient="from-indigo-500 via-purple-500 to-pink-500"
        >
          Login
        </GradientButton>
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