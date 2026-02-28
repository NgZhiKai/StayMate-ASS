import React, { useEffect, useState } from "react";
import AmountInput from "./AmountInput";

interface AmountSectionProps {
  remainingAmount: number;
  onAmountChange: (amount: number) => void;
}

const AmountSection: React.FC<AmountSectionProps> = ({
  remainingAmount,
  onAmountChange,
}) => {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    onAmountChange(amount);
  }, [amount, onAmountChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setAmount(value);

    const valueCents = Math.round(value * 100);
    const remainingCents = Math.round(remainingAmount * 100);

    if (valueCents <= 0) {
      setError("Amount must be greater than zero");
    } else if (valueCents > remainingCents) {
      setError("Amount exceeds outstanding balance");
    } else {
      setError("");
    }
  };

  return (
    <AmountInput
      value={amount}
      onChange={handleChange}
      error={error}
    />
  );
};

export default AmountSection;