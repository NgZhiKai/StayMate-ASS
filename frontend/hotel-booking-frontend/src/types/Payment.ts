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