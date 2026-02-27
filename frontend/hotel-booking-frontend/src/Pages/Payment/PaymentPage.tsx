import React from "react";
import { MessageModal } from "../../components/Modal";
import {
  AmountSection,
  BookingSummaryCard,
  ConfirmPayment,
  PaymentLayout
} from "../../components/Payment";
import { Stepper } from "../../components/Stepper";
import { usePaymentPage } from "../../hooks/usePaymentPage";

const steps = ["Booking", "Payment Selection", "Payment"];

const PaymentPage: React.FC = () => {
  const {
    invalid,
    loading,
    booking,
    hotel,
    hotelName,
    paymentType,
    totalAmount,
    amountAlreadyPaid,
    remainingAmount,
    amountPaidNow,
    setAmountPaidNow,
    fields,
    setFields,
    isLoading,
    modalMessage,
    modalType,
    setModalMessage,
    handleConfirmPayment,
  } = usePaymentPage();

  if (invalid) return null;
  if (loading) return <div>Loading booking details...</div>;
  if (!booking || !hotel) return <div>Booking not found</div>;

  return (
    <PaymentLayout>
      <Stepper steps={steps} currentStep={2} />

      <h2 className="text-4xl font-extrabold text-gray-800 text-center">
        Complete Your Payment
      </h2>

      <div className="text-gray-600 text-center mb-4">
        Paying for{" "}
        <span className="font-semibold text-gray-800">
          {hotelName || hotel.name}
        </span>
      </div>

      <BookingSummaryCard
        total={totalAmount}
        paid={amountAlreadyPaid}
        outstanding={remainingAmount}
      />

      <AmountSection
        remainingAmount={remainingAmount}
        onAmountChange={setAmountPaidNow}
      />

      <ConfirmPayment
        paymentType={paymentType}
        fields={fields}
        setFields={setFields}
        amountPaidNow={amountPaidNow}
        onConfirm={handleConfirmPayment}
        isLoading={isLoading}
        disabled={
          Math.round(amountPaidNow * 100) <= 0 ||
          Math.round(amountPaidNow * 100) > Math.round(remainingAmount * 100)
        }
      />

      <MessageModal
        isOpen={!!modalMessage}
        onClose={() => setModalMessage("")}
        message={modalMessage}
        type={modalType}
      />
    </PaymentLayout>
  );
};

export default PaymentPage;