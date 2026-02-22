import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  name?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  name,
  placeholder = "",
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder=" "
        readOnly={readOnly}
        className={`peer w-full px-4 pt-5 pb-2 rounded-xl border text-gray-800 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        required
      />
      <label
        className="absolute left-4 top-2.5 text-gray-400 text-sm transition-all
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
          peer-focus:top-2.5 peer-focus:text-indigo-500 peer-focus:text-sm"
      >
        {label}
      </label>
    </div>
  );
};

export default InputField;