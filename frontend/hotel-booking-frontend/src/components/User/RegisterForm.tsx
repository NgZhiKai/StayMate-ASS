import React, { useState } from "react";
import { RegisterData } from "../../types/User";
import MessageModal from "../MessageModal";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface RegisterFormProps {
  onRegister: (registerData: RegisterData) => void;
  error: string | null;
  registerData: RegisterData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  isEmailReadonly?: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  error,
  registerData,
  handleChange,
  confirmPassword,
  setConfirmPassword,
  isEmailReadonly = false,
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleModal = (open: boolean) => setIsModalOpen(open);

  const validateForm = () => {
    const errors: string[] = [];

    if (!registerData.firstName.trim()) errors.push("First name is required.");
    if (!registerData.lastName.trim()) errors.push("Last name is required.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) errors.push("Please enter a valid email.");
    if (!registerData.phoneNumber.trim()) errors.push("Phone number is required.");
    if (registerData.password.length < 8) errors.push("Password must be at least 8 characters.");
    if (registerData.password !== confirmPassword) errors.push("Passwords do not match.");

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onRegister(registerData);
      setModalMessage(
        "Your account has been created successfully!\nRedirecting to login..."
      );
      handleModal(true);
    } catch (err: any) {
      setModalMessage(err.message || "An error occurred during registration.");
      handleModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "peer w-full px-3 pt-3 pb-1 border border-gray-300 rounded-lg text-sm placeholder-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent";
  const labelBase =
    "absolute left-3 text-gray-400 text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/90 backdrop-blur-md shadow-lg rounded-xl p-4 w-full max-w-md mx-auto space-y-2 max-h-[calc(100vh-4rem)] overflow-auto"
      noValidate
    >
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Create Account</h2>

      {/* Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => handleModal(false)}
        message={modalMessage}
        type={validationErrors.length > 0 || error ? "error" : "success"}
      />

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-600">
          <ul className="list-disc list-inside space-y-0.5">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* First & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {["firstName", "lastName"].map((field) => (
          <div key={field} className="relative">
            <input
              id={field}
              name={field}
              type="text"
              value={registerData[field as keyof RegisterData] as string}
              onChange={handleChange}
              placeholder={field === "firstName" ? "First Name" : "Last Name"}
              className={inputBase}
            />
            <label htmlFor={field} className={labelBase}>
              {field === "firstName" ? "First Name" : "Last Name"}
            </label>
          </div>
        ))}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            value={registerData.email}
            onChange={handleChange}
            placeholder="Email"
            className={inputBase + (isEmailReadonly ? " bg-gray-100 cursor-not-allowed" : "")}
            readOnly={isEmailReadonly} // make it read-only
          />
          <label htmlFor="email" className={labelBase}>
            Email
          </label>
        </div>
        <div className="relative">
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={registerData.phoneNumber}
            onChange={(e) => /^\+?\d*$/.test(e.target.value) && handleChange(e)}
            placeholder="+65 9123 4567"
            className={inputBase}
          />
          <label htmlFor="phoneNumber" className={labelBase}>
            Phone Number
          </label>
        </div>
      </div>

      {/* Password & Confirm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleChange}
            placeholder="Password"
            className={inputBase}
          />
          <label htmlFor="password" className={labelBase}>
            Password
          </label>
          <span className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <AiFillEyeInvisible size={16} /> : <AiFillEye size={16} />}
            </button>
          </span>
        </div>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className={inputBase}
          />
          <label htmlFor="confirmPassword" className={labelBase}>
            Confirm Password
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-medium shadow hover:scale-105 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterForm;