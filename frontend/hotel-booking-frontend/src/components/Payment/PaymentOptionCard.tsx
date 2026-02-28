import React from "react";
import { PaymentType } from "../../types/Payment";

interface PaymentOptionCardProps {
  option: { id: PaymentType; label: string; logos: string[] };
  isSelected: boolean;
  onSelect: (id: PaymentType) => void;
}

const PaymentOptionCard: React.FC<PaymentOptionCardProps> = ({ option, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(option.id)}
    className={`cursor-pointer p-6 rounded-2xl border transition flex flex-col items-center justify-center gap-4 shadow-md hover:shadow-lg
      ${isSelected
        ? "border-indigo-500 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 scale-105"
        : "border-gray-200 bg-white"
      }`}
  >
    <div className="flex gap-3 items-center justify-center">
      {option.logos.map((logo) => (
        <img key={logo} src={logo} alt={`${option.label} logo`} className="w-12 h-12 object-contain" />
      ))}
    </div>
    <span className="font-semibold text-gray-700 text-lg">{option.label}</span>
  </button>
);

export default PaymentOptionCard;
