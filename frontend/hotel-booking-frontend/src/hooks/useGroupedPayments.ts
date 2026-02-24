import { useEffect, useState } from "react";
import { bookingApi } from "../services/Booking";
import { paymentApi } from "../services/Payment";
import { userApi } from "../services/User"; // <-- import user API
import { Payment } from "../types/Payment";

export interface GroupedPayment {
  bookingId: number;
  totalAmount: number;
  status: string;
  latestTransactionDate: string;
  payments: Payment[];
  bookingDetails?: any; // DetailedBooking type
  user?: { firstName: string; lastName: string }; // added user info
}

export const useGroupedPayments = () => {
  const [groupedPayments, setGroupedPayments] = useState<GroupedPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const payments = await paymentApi.getAllPayments();

        // Group payments by bookingId
        const groupsMap: { [key: number]: GroupedPayment } = {};
        payments.forEach((p) => {
          if (!groupsMap[p.bookingId]) {
            groupsMap[p.bookingId] = {
              bookingId: p.bookingId,
              totalAmount: p.amount,
              status: p.status,
              latestTransactionDate: p.transactionDate,
              payments: [p],
            };
          } else {
            groupsMap[p.bookingId].totalAmount += p.amount;
            groupsMap[p.bookingId].payments.push(p);
            if (new Date(p.transactionDate) > new Date(groupsMap[p.bookingId].latestTransactionDate)) {
              groupsMap[p.bookingId].latestTransactionDate = p.transactionDate;
              groupsMap[p.bookingId].status = p.status; // latest status
            }
          }
        });

        const groupedArray = Object.values(groupsMap);

        // Fetch booking details AND user info
        const bookingPromises = groupedArray.map(async (g) => {
          const bookingDetails = await bookingApi.fetchBookingById(g.bookingId);

          let user;
          try {
            const userData = await userApi.getUserInfo(bookingDetails.userId.toString());
            user = { firstName: userData.user.firstName, lastName: userData.user.lastName };
          } catch {
            user = { firstName: "Unknown", lastName: "" };
          }

          return { ...g, bookingDetails, user };
        });

        const results = await Promise.all(bookingPromises);
        setGroupedPayments(results);
      } catch (err: any) {
        setError("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return { groupedPayments, loading, error };
};