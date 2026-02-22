import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Stepper from "../../components/Stepper/Stepper";
import PaymentOptionsGrid from "../../components/Payment/PaymentOptionsGrid";
import { PaymentType } from "../../components/Payment/PaymentOptionCard";

import mastercard from "../../assets/logos/mastercard.png";
import visa from "../../assets/logos/visa.png";
import paypal from "../../assets/logos/paypal.png";
import stripe from "../../assets/logos/stripe.png";

const paymentOptions = [
  { id: "CREDIT_CARD" as PaymentType, label: "Credit Card", logos: [mastercard, visa] },
  { id: "PAYPAL" as PaymentType, label: "PayPal", logos: [paypal] },
  { id: "STRIPE" as PaymentType, label: "Stripe", logos: [stripe] },
];

const steps = ["Booking", "Payment Selection", "Payment"];

interface LocationState {
  bookingId?: number;
  hotelName?: string;
}

const SelectPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const bookingId = state?.bookingId;
  const hotelName = state?.hotelName;
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | "">("");

  if (!bookingId) return <div className="p-6 text-center text-gray-500">No booking selected.</div>;

  const handleContinue = () => {
    if (!selectedPayment) return alert("Please select a payment method.");
    navigate(`/payments/${bookingId}`, { state: { bookingId, hotelName, paymentType: selectedPayment } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-2xl w-full text-center">
        <Stepper steps={steps} currentStep={1} />

        <h1 className="text-3xl font-bold mb-2 text-gray-800">Select Payment Method</h1>
        <p className="text-gray-600 mb-8">
          Booking at <span className="font-semibold">{hotelName}</span>
        </p>

        <PaymentOptionsGrid
          options={paymentOptions}
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />

        <button
          onClick={handleContinue}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default SelectPaymentPage;