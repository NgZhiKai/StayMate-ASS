import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isPaymentType } from "../components/Payment/PaymentModal";
import { useNotificationContext } from "../contexts/NotificationContext";
import { paymentApi } from "../services/Payment";
import { PaymentType } from "../types/Payment";
import { useBookingPayment } from "./useBookingPayment";

interface LocationState {
  bookingId?: number;
  hotelName?: string;
  paymentType?: string;
}

type ModalType = "success" | "error";

export const usePaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { refreshNotifications } = useNotificationContext();

  // ---- Guard invalid state ----
  const bookingId = state?.bookingId;
  const hotelName = state?.hotelName;
  const rawPaymentType = state?.paymentType;

  if (!bookingId || !rawPaymentType || !isPaymentType(rawPaymentType)) {
    navigate("/");
    return { invalid: true } as const;
  }

  const paymentType: PaymentType = rawPaymentType;

  // ---- Booking Data ----
  const {
    booking,
    hotel,
    amountAlreadyPaid: rawAmountAlreadyPaid,
    loading,
  } = useBookingPayment(bookingId);

  // ---- Safe Numeric Values (NO undefined) ----
  const totalAmount: number = booking?.totalAmount ?? 0;
  const amountAlreadyPaid: number = rawAmountAlreadyPaid ?? 0;
  const remainingAmount: number = Math.max(
    totalAmount - amountAlreadyPaid,
    0
  );

  // ---- Local State ----
  const [amountPaidNow, setAmountPaidNow] = useState<number>(0);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<ModalType>("success");

  // ---- Payment Logic ----
  const handleConfirmPayment = async () => {
    if (amountPaidNow <= 0 || amountPaidNow > remainingAmount) {
      setModalType("error");
      setModalMessage("Invalid payment amount.");
      return;
    }

    setIsLoading(true);

    try {
      await paymentApi.createAndProcessPayment(
        { bookingId, amount: amountPaidNow },
        paymentType
      );

      setModalType("success");
      setModalMessage("Payment successful!");
      refreshNotifications();

      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      setModalType("error");
      setModalMessage(
        `Payment failed: ${error?.message || "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invalid: false,
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
  };
};