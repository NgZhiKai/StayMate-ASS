import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper/Stepper";
import BookingSummaryCard from "../../components/Payment/BookingSummaryCard";
import AmountInput from "../../components/Payment/AmountInput";
import PaymentButton from "../../components/Payment/PaymentButton";
import PaymentModal from "../../components/Payment/PaymentModal";
import MessageModal from "../../components/Modal/MessageModal";

import { fetchBookingById } from "../../services/Booking/bookingApi";
import { fetchHotelById } from "../../services/Hotel/hotelApi";
import { createAndProcessPayment, getPaymentsByBookingId } from "../../services/Payment/paymentApi";
import { useNotificationContext } from "../../contexts/NotificationContext";

const steps = ["Booking", "Payment Selection", "Payment"];

type PaymentType = "CREDIT_CARD" | "PAYPAL" | "STRIPE";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId, hotelName: passedHotelName, paymentType } = location.state || {};
  const { refreshNotifications } = useNotificationContext();

  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [hotelDetails, setHotelDetails] = useState<any>(null);
  const [amountPaidNow, setAmountPaidNow] = useState<number>(0);
  const [amountAlreadyPaid, setAmountAlreadyPaid] = useState<number>(0);
  const [amountError, setAmountError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [fields, setFields] = useState<any>({});
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchData = async () => {
      if (!bookingId || !paymentType) return navigate("/");
      try {
        const booking = await fetchBookingById(bookingId);
        setBookingDetails(booking);

        const hotel = await fetchHotelById(booking.hotelId);
        setHotelDetails(hotel);

        const payments = await getPaymentsByBookingId(bookingId);
        const totalPaid = payments?.length ? payments.reduce((sum, p) => sum + Number(p.amountPaid), 0) : 0;
        setAmountAlreadyPaid(totalPaid);
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    fetchData();
  }, [bookingId, paymentType, navigate]);

  if (!bookingDetails || !hotelDetails) return <div>Loading booking details...</div>;

  const totalAmount = bookingDetails.totalAmount;
  const remainingAmount = totalAmount - amountAlreadyPaid;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmountPaidNow(value);
    if (value <= 0) setAmountError("Amount must be greater than zero");
    else if (value > remainingAmount) setAmountError("Amount exceeds outstanding balance");
    else setAmountError("");
  };

  const handleConfirmPayment = async () => {
    if (!paymentType) return;
    setIsLoading(true);
    try {
      await createAndProcessPayment({ bookingId, amount: amountPaidNow }, paymentType);
      setModalType("success");
      setModalMessage("Payment successful!");
      setPaymentModalOpen(false);
      refreshNotifications();
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      console.error(error);
      setModalType("error");
      setModalMessage(`Payment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-50 p-6 select-none">
      <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-2xl space-y-8">
        <Stepper steps={steps} currentStep={2} />

        <h2 className="text-4xl font-extrabold text-gray-800 text-center">Complete Your Payment</h2>
        <div className="text-gray-600 text-center mb-4">
          Paying for <span className="font-semibold text-gray-800">{passedHotelName || hotelDetails.name}</span>
        </div>

        <BookingSummaryCard total={totalAmount} paid={amountAlreadyPaid} outstanding={remainingAmount} />

        <AmountInput value={amountPaidNow} onChange={handleAmountChange} error={amountError} />

        <PaymentButton onClick={() => setPaymentModalOpen(true)} disabled={!!amountError || !amountPaidNow}>
          Make Payment
        </PaymentButton>

        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          paymentType={paymentType}
          fields={fields}
          setFields={setFields}
          onConfirm={handleConfirmPayment}
          isLoading={isLoading}
        />

        <MessageModal
          isOpen={!!modalMessage}
          onClose={() => setModalMessage("")}
          message={modalMessage}
          type={modalType}
        />
      </div>
    </div>
  );
};

export default PaymentPage;