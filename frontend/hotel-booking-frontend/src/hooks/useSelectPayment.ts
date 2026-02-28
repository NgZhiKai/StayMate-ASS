import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentType } from "../types/Payment";

interface LocationState {
  bookingId?: number;
  hotelName?: string;
}

export const useSelectPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const bookingId = state?.bookingId;
  const hotelName = state?.hotelName;
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | "">("");

  const handleContinue = () => {
    if (!selectedPayment) return alert("Please select a payment method.");
    navigate(`/payments/${bookingId}`, { state: { bookingId, hotelName, paymentType: selectedPayment } });
  };

  return {
    bookingId,
    hotelName,
    selectedPayment,
    setSelectedPayment,
    handleContinue,
  };
};