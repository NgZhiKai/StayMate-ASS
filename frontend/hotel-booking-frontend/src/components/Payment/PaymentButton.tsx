import React from "react";

interface PaymentButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-4 text-white font-semibold rounded-2xl shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 disabled:opacity-50"
  >
    {children}
  </button>
);

export default PaymentButton;