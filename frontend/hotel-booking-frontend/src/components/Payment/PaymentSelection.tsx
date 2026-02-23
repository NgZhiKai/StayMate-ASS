import React from "react";
import { PaymentType } from "../../types/Payment";
import PaymentOptionsGrid from "./PaymentOptionsGrid";

interface PaymentSelectionProps {
  options: { id: PaymentType; label: string; logos: string[] }[];
  selected: PaymentType | "";
  onSelect: (payment: PaymentType) => void;
}

const PaymentSelection: React.FC<PaymentSelectionProps> = ({ options, selected, onSelect }) => (
  <div className="mb-8">
    <PaymentOptionsGrid options={options} selected={selected} onSelect={onSelect} />
  </div>
);

export default PaymentSelection;