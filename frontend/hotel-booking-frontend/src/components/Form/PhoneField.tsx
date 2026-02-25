import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
}) => (
  <div className="flex flex-col">
    {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
    <div className="mt-1 w-full">
      <PhoneInput
        country="sg"
        value={value}
        onChange={onChange}
        containerClass="!w-full !h-[48px]"
        inputClass="!w-full !h-[48px] !pl-16 !pr-4 !rounded-xl !border !border-gray-300 !bg-white !text-gray-700 focus:!ring-2 focus:!ring-indigo-500 focus:!border-transparent"
        buttonClass="!border-none !bg-transparent !rounded-l-xl !h-[48px]"
        dropdownClass="!rounded-xl !shadow-xl"
        inputProps={{
          required,
        }}
      />
    </div>
  </div>
);

export default PhoneField;