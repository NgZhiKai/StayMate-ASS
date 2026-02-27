export interface Payment {
    id: number;
    bookingId: number;
    amount: number;
    status: string;
    transactionDate: string;
    paymentMethod: string;
    amountPaid?: number;
  }

  export interface PaymentRequest {
    bookingId: number;
    amount: number;
  }

  export type PaymentType = "CREDIT_CARD" | "PAYPAL" | "STRIPE";

  export interface GroupedPayments {
    bookingId: number;
    payments: Payment[];
    totalAmount: number;
    totalPaid: number;
    remainingAmount: number;
    isFullyPaid: boolean;
  }

  export interface GroupedPayment {
  bookingId: number;
  totalAmount: number;
  status: string;
  latestTransactionDate: string;
  payments: Payment[];
  bookingDetails?: any; // DetailedBooking type
  user?: { firstName: string; lastName: string };
  hotelName?: string; // <-- new field
}