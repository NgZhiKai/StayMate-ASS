import React from "react";
import { RegisterData } from "../../types/User";

interface RegisterFormProps {
  registerData: RegisterData;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRegister: (data: RegisterData) => void;
  isEmailReadonly?: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerData,
  confirmPassword,
  setConfirmPassword,
  handleChange,
  onRegister,
  isEmailReadonly = false,
  error,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onRegister(registerData);
      }}
      className="space-y-4"
    >
      <div className="flex gap-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={registerData.firstName}
          onChange={handleChange}
          className="w-1/2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={registerData.lastName}
          onChange={handleChange}
          className="w-1/2 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          required
        />
      </div>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={registerData.email}
        onChange={handleChange}
        readOnly={isEmailReadonly}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none ${
          isEmailReadonly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={registerData.password}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />

      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        value={registerData.phoneNumber}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
        required
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg hover:scale-105 transform transition-all"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;