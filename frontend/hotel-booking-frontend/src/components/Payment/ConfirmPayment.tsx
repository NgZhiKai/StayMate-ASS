import React, { useState } from "react";
import { PaymentType } from "../../types/Payment";
import PaymentButton from "./PaymentButton";
import PaymentModal from "./PaymentModal";

interface ConfirmPaymentProps {
  paymentType: PaymentType;
  fields: any;
  setFields: (fields: any) => void;
  amountPaidNow: number;
  onConfirm: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ConfirmPayment: React.FC<ConfirmPaymentProps> = ({
  paymentType,
  fields,
  setFields,
  amountPaidNow,
  onConfirm,
  isLoading,
  disabled = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);

  const handleClose = () => {
    setFields({}); // reset all fields on cancel
    setModalOpen(false);
  };

  return (
    <>
      <PaymentButton onClick={handleOpen} disabled={disabled || amountPaidNow <= 0}>
        Make Payment
      </PaymentButton>

      <PaymentModal
        isOpen={modalOpen}
        onClose={handleClose}
        paymentType={paymentType}
        fields={fields}
        setFields={setFields}
        onConfirm={onConfirm}
        isLoading={isLoading}
      />
    </>
  );
};

export default ConfirmPayment;