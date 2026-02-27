import { Payment, PaymentRequest, PaymentType } from "../../types/Payment";
import { handleApiError } from "../../utils/handleApiError";
import { paymentApiClient } from "./paymentApiClient";

const PAYMENT_BASE = "/payments";

const mapPayment = (p: any): Payment => ({
  id: p.paymentId,
  bookingId: p.bookingId,
  amount: p.amountPaid,
  status: p.paymentStatus,
  paymentMethod: p.paymentMethod,
  transactionDate: p.paymentDateTime,
});

const paymentApi = {
  /**
   * Create and process payment
   */
  createAndProcessPayment: async (
    paymentRequest: PaymentRequest,
    paymentMethod: PaymentType
  ): Promise<{ message: string }> => {
    try {
      const response = await paymentApiClient.post(
        PAYMENT_BASE,
        paymentRequest,
        { params: { paymentMethod } }
      );

      if (!response.data) {
        throw new Error("Error processing payment");
      }

      return response.data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Get payment by ID
   */
  getPaymentById: async (paymentId: number): Promise<Payment> => {
    try {
      const response = await paymentApiClient.get(`${PAYMENT_BASE}/${paymentId}`);
      const data = response.data;

      if (!data) {
        throw new Error("Payment not found");
      }

      return data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Get payments by booking ID
   */
  getPaymentsByBookingId: async (bookingId: number): Promise<Payment[]> => {
    try {
      const response = await paymentApiClient.get(
        `${PAYMENT_BASE}/booking/${bookingId}`
      );

      const data = response.data?.data ?? [];
      return data;
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Get payments by user ID
   */
  getPaymentsByUserId: async (userId: number): Promise<Payment[]> => {
    try {
      const response = await paymentApiClient.get(
        `${PAYMENT_BASE}/user/${userId}`
      );

      const data = response.data?.data ?? [];
      return data.map(mapPayment);
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  /**
   * Get all payments
   */
  getAllPayments: async (): Promise<Payment[]> => {
    try {
      const response = await paymentApiClient.get(PAYMENT_BASE);

      const data = response.data?.data ?? [];
      return data.map(mapPayment);
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default paymentApi;