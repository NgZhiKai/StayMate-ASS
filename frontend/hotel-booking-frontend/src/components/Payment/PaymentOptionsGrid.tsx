import React from "react";
import { PaymentType } from "../../types/Payment";
import PaymentOptionCard from "./PaymentOptionCard";

interface PaymentOptionsGridProps {
  options: { id: PaymentType; label: string; logos: string[] }[];
  selected: PaymentType | "";
  onSelect: (id: PaymentType) => void;
}

const PaymentOptionsGrid: React.FC<PaymentOptionsGridProps> = ({ options, selected, onSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {options.map((option) => (
      <PaymentOptionCard
        key={option.id}
        option={option}
        isSelected={selected === option.id}
        onSelect={onSelect}
      />
    ))}
  </div>
);

export default PaymentOptionsGrid;