import { Payment, PaymentRequest, PaymentType } from "../../types/Payment";
import { toApiError } from "../_core/apiError";
import { getDataOrDefault, getDataOrThrow } from "../_core/response";
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

      return getDataOrThrow<{ message: string }>(
        { data: response.data, message: response.data?.message },
        "Error processing payment"
      );
    } catch (error) {
      throw toApiError(error);
    }
  },

  /**
   * Get payment by ID
   */
  getPaymentById: async (paymentId: number): Promise<Payment> => {
    try {
      const response = await paymentApiClient.get(`${PAYMENT_BASE}/${paymentId}`);
      return getDataOrThrow<Payment>({ data: response.data, message: response.data?.message }, "Payment not found");
    } catch (error) {
      throw toApiError(error);
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

      const data = getDataOrDefault<Payment[]>(response.data, []);
      return data;
    } catch (error) {
      throw toApiError(error);
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

      const data = getDataOrDefault<any[]>(response.data, []);
      return data.map(mapPayment);
    } catch (error) {
      throw toApiError(error);
    }
  },

  /**
   * Get all payments
   */
  getAllPayments: async (): Promise<Payment[]> => {
    try {
      const response = await paymentApiClient.get(PAYMENT_BASE);

      const data = getDataOrDefault<any[]>(response.data, []);
      return data.map(mapPayment);
    } catch (error) {
      throw toApiError(error);
    }
  },
};

export default paymentApi;
