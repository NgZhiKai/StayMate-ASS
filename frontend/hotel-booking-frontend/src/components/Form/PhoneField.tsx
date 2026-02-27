import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString, AsYouType } from "libphonenumber-js";

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
  value,
  onChange,
  label = "Phone Number",
  required = false,
}) => {
  const handleChange = (phone: string) => {
    if (!phone) {
      onChange("");
      return;
    }

    // Sanitize: remove any leading spaces after '+'
    let sanitized = phone.replace(/^\+\s*/, "+");
    if (!sanitized.startsWith("+")) sanitized = `+${sanitized}`;

    // Try to parse the number
    const phoneNumber = parsePhoneNumberFromString(sanitized);
    if (phoneNumber && phoneNumber.isValid()) {
      // Valid number: store E.164 internally
      onChange(phoneNumber.number);
    } else {
      // Invalid: store sanitized raw input
      onChange(sanitized);
    }
  };

  // Display value nicely with spaces if valid, else raw
  const displayValue = (() => {
    const phoneNumber = parsePhoneNumberFromString(value);
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.formatInternational(); // nicely spaced for display
    }
    return value; // fallback for invalid numbers
  })();

  return (
    <div className="flex flex-col">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      <div className="mt-1 w-full">
        <PhoneInput
          country="sg"
          value={displayValue}
          onChange={handleChange}
          enableAreaCodes
          containerClass="!w-full !h-[48px]"
          inputClass="!w-full !h-[48px] !pl-16 !pr-4 !rounded-xl !border !border-gray-300 !bg-white !text-gray-700 focus:!ring-2 focus:!ring-indigo-500 focus:!border-transparent"
          buttonClass="!border-none !bg-transparent !rounded-l-xl !h-[48px]"
          dropdownClass="!rounded-xl !shadow-xl"
          inputProps={{ required }}
        />
      </div>
    </div>
  );
};

export default PhoneField;