import React, { useState, useEffect } from "react";
import AmountInput from "./AmountInput";

interface AmountSectionProps {
  remainingAmount: number;
  onAmountChange: (amount: number) => void;
}

const AmountSection: React.FC<AmountSectionProps> = ({ remainingAmount, onAmountChange }) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    onAmountChange(amount); // notify parent of amount changes
  }, [amount, onAmountChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(value);

    if (value <= 0) setError("Amount must be greater than zero");
    else if (value > remainingAmount) setError("Amount exceeds outstanding balance");
    else setError("");
  };

  return <AmountInput value={amount} onChange={handleChange} error={error} />;
};

export default AmountSection;