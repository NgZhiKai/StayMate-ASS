import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isPaymentType } from "../components/Payment/PaymentModal";
import { useNotificationContext } from "../contexts/NotificationContext";
import { paymentApi } from "../services/Payment";
import { PaymentType } from "../types/Payment";
import { useBookingPayment } from "./useBookingPayment";
import { useBookingContext } from "../contexts/BookingContext";

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
  const { refreshBookings } = useBookingContext();

  // ---- Extract state safely ----
  const bookingId = state?.bookingId;
  const hotelName = state?.hotelName;
  const rawPaymentType = state?.paymentType;

  // Always declare hooks first
  const [amountPaidNow, setAmountPaidNow] = useState<number>(0);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<ModalType>("success");

  // ---- Hooks for booking ----
  const { booking, hotel, amountAlreadyPaid: rawAmountAlreadyPaid, loading } =
    useBookingPayment(bookingId ?? 0); // pass 0 if undefined

  // ---- Determine if invalid ----
  const invalid = !bookingId || !rawPaymentType || !isPaymentType(rawPaymentType);

  useEffect(() => {
    if (invalid) {
      navigate("/");
    }
  }, [invalid, navigate]);

  const paymentType: PaymentType = isPaymentType(rawPaymentType) ? rawPaymentType : "CREDIT_CARD";

  const totalAmount = booking?.totalAmount ?? 0;
  const amountAlreadyPaid = rawAmountAlreadyPaid ?? 0;
  const remainingAmount = Math.max(totalAmount - amountAlreadyPaid, 0);
  const totalCents = Math.round(totalAmount * 100);
  const paidCents = Math.round(amountAlreadyPaid * 100);
  const remainingCents = Math.max(totalCents - paidCents, 0);

  const handleConfirmPayment = async () => {
    if (!bookingId || invalid) return;

    const payNowCents = Math.round(amountPaidNow * 100);

    if (payNowCents <= 0 || payNowCents > remainingCents) {
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
      refreshBookings();
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      setModalType("error");
      setModalMessage(`Payment failed: ${error?.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
