import React from "react";
import mastercard from "../../assets/logos/mastercard.png";
import paypal from "../../assets/logos/paypal.png";
import stripe from "../../assets/logos/stripe.png";
import visa from "../../assets/logos/visa.png";
import { PageAction } from "../../components/Layout";
import PageHeader from "../../components/Layout/PageHeader";
import { PaymentType } from "../../components/Payment/PaymentOptionCard";
import PaymentSelection from "../../components/Payment/PaymentSelection";
import { useSelectPayment } from "../../hooks/useSelectPayment";

const paymentOptions = [
  { id: "CREDIT_CARD" as PaymentType, label: "Credit Card", logos: [mastercard, visa] },
  { id: "PAYPAL" as PaymentType, label: "PayPal", logos: [paypal] },
  { id: "STRIPE" as PaymentType, label: "Stripe", logos: [stripe] },
];

const steps = ["Booking", "Payment Selection", "Payment"];

const SelectPaymentPage: React.FC = () => {
  const { bookingId, hotelName, selectedPayment, setSelectedPayment, handleContinue } = useSelectPayment();

  if (!bookingId) return <div className="p-6 text-center text-gray-500">No booking selected.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-2xl w-full">
        <PageHeader
          steps={steps}
          currentStep={1}
          title="Select Payment Method"
          subtitle={`Booking at ${hotelName}`}
        />

        <PaymentSelection
          options={paymentOptions}
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />

        <div className="flex justify-center">
          <PageAction onClick={handleContinue} label="Continue to Payment" />
        </div>
      </div>
    </div>
  );
};

export default SelectPaymentPage;