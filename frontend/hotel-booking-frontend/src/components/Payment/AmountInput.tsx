import React from "react";

interface AmountInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({ value, onChange, error }) => (
  <div>
    <label className="block text-gray-700 mb-2 font-medium">Amount You’re Paying Now</label>
    <input
      type="number"
      placeholder="Enter amount"
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent text-lg"
    />
    {error && <p className="text-red-600 mt-2">{error}</p>}
  </div>
);

export default AmountInput;