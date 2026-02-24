import React from "react";
import { RegisterData } from "../../../types/User";
import GradientButton from "../../Button/GradientButton";
import InputField from "../../Form/InputField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface RegisterFormProps {
  registerData: RegisterData;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onRegister: () => void;
  isEmailReadonly: boolean;
  error?: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerData,
  confirmPassword,
  setConfirmPassword,
  handleChange,
  onRegister,
  isEmailReadonly,
  error,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onRegister();
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Row 1 */}
        <InputField
          label="First Name"
          type="text"
          name="firstName"
          value={registerData.firstName}
          onChange={handleChange}
        />
        <InputField
          label="Last Name"
          type="text"
          name="lastName"
          value={registerData.lastName}
          onChange={handleChange}
        />

        {/* Row 2 */}
        <InputField
          label="Email"
          type="email"
          name="email"
          value={registerData.email}
          onChange={handleChange}
          readOnly={isEmailReadonly}
        />

        {/* Phone Number with PhoneInput */}
        <div>
          <label className="text-sm font-medium text-gray-600">Phone Number</label>
          <div className="mt-1">
            <PhoneInput
              country="sg"
              value={registerData.phoneNumber}
              onChange={(value: string) =>
                handleChange({
                  target: { name: "phoneNumber", value },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              containerClass="!w-full"
              inputClass="!w-full !h-[48px] !pl-14 !pr-4 !rounded-xl !border !border-gray-200 !bg-white !text-gray-700 !shadow-sm focus:!ring-2 focus:!ring-indigo-400 focus:!border-indigo-400"
              buttonClass="!border-none !bg-transparent !rounded-l-xl"
              dropdownClass="!rounded-xl !shadow-xl"
            />
          </div>
        </div>

        {/* Row 3 */}
        <InputField
          label="Password"
          type="password"
          name="password"
          value={registerData.password}
          onChange={handleChange}
        />
        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Submit button spanning full width */}
      <GradientButton
        type="submit"
        className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      >
        Register
      </GradientButton>
    </form>
  );
};

export default RegisterForm;