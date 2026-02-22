import { paymentApiClient } from "./paymentApiClient";
import { Payment, PaymentRequest } from "../../types/Payment";

const PAYMENT_BASE = "/payments";

/**
 * Create and process payment
 */
export const createAndProcessPayment = async (
  paymentRequest: PaymentRequest,
  paymentMethod: string
): Promise<string> => {
  const response = await paymentApiClient.post(
    PAYMENT_BASE,
    paymentRequest,
    { params: { paymentMethod } }
  );

  if (!response.data) {
    throw new Error("Error processing payment");
  }

  return response.data;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId: number): Promise<Payment> => {
  const response = await paymentApiClient.get(`${PAYMENT_BASE}/${paymentId}`);
  const data = response.data;

  if (!data) {
    throw new Error("Payment not found");
  }

  return data;
};

/**
 * Get payments by booking ID
 */
export const getPaymentsByBookingId = async (bookingId: number): Promise<Payment[]> => {
  const response = await paymentApiClient.get(`${PAYMENT_BASE}/booking/${bookingId}`);
  return response.data?.data ?? [];
};

/**
 * Get payments by user ID
 */
export const getPaymentsByUserId = async (userId: number): Promise<Payment[]> => {
  const response = await paymentApiClient.get(`${PAYMENT_BASE}/user/${userId}`);
  const data = response.data?.data ?? [];

  return data.map((p: any) => ({
    id: p.paymentId,
    bookingId: p.bookingId,
    amount: p.amountPaid,
    status: p.paymentStatus,
    paymentMethod: p.paymentMethod,
    transactionDate: p.paymentDateTime,
  }));
};

/**
 * Get all payments
 */
export const getAllPayments = async (): Promise<Payment[]> => {
  const response = await paymentApiClient.get(PAYMENT_BASE);
  const data = response.data?.data ?? [];

  return data.map((p: any) => ({
    id: p.paymentId,
    bookingId: p.bookingId,
    amount: p.amountPaid,
    status: p.paymentStatus,
    transactionDate: p.paymentDateTime,
  }));
};