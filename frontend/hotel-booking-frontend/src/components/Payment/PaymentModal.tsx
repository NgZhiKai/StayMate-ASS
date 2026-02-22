import React from "react";
import { CreditCardForm } from "./CreditCardForm";
import { PaypalForm } from "./PaypalForm";
import { StripeForm } from "./StripeForm";
import PaymentButton from "./PaymentButton";

type PaymentType = "CREDIT_CARD" | "PAYPAL" | "STRIPE";

const paymentForms: Record<PaymentType, React.FC<any>> = {
  CREDIT_CARD: CreditCardForm,
  PAYPAL: PaypalForm,
  STRIPE: StripeForm,
};

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: PaymentType;
  fields: any;
  setFields: any;
  onConfirm: () => void;
  isLoading: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, paymentType, fields, setFields, onConfirm, isLoading }) => {
  if (!isOpen) return null;
  const CurrentForm = paymentForms[paymentType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-6 shadow-2xl">
        <h3 className="text-xl font-bold text-center mb-4">{paymentType.replace("_", " ")} Payment</h3>
        {CurrentForm && <CurrentForm fields={fields} setFields={setFields} />}
        <PaymentButton onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Processing..." : "Confirm Payment"}
        </PaymentButton>
        <button
          onClick={onClose}
          className="w-full py-2 text-gray-700 border rounded-2xl hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;