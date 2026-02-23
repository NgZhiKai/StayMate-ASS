import { useEffect, useState } from "react";
import { paymentApi } from "../services/Payment";
import { fetchBookingById } from "../services/Booking/bookingApi";
import { Payment } from "../types/Payment";
import { DetailedBooking } from "../types/Booking";

export interface GroupedPayments {
  bookingId: number;
  payments: Payment[];
  totalAmount: number;
  totalPaid: number;
  remainingAmount: number;
  isFullyPaid: boolean;
}

export const useMyPayments = () => {
  const [loading, setLoading] = useState(true);
  const [groupedPayments, setGroupedPayments] = useState<GroupedPayments[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userIdStr = sessionStorage.getItem("userId");
        if (!userIdStr) return;

        const userId = Number(userIdStr);
        const paymentsData: Payment[] = await paymentApi.getPaymentsByUserId(userId);

        const grouped: Record<number, GroupedPayments> = {};
        for (const p of paymentsData) {
          if (!grouped[p.bookingId]) {
            grouped[p.bookingId] = {
              bookingId: p.bookingId,
              payments: [],
              totalAmount: 0,
              totalPaid: 0,
              remainingAmount: 0,
              isFullyPaid: false,
            };
          }
          grouped[p.bookingId].payments.push(p);
        }

        // fetch booking totals
        const bookingIds = Object.keys(grouped).map(Number);
        await Promise.all(
          bookingIds.map(async (bookingId) => {
            try {
              const booking: DetailedBooking = await fetchBookingById(bookingId);
              grouped[bookingId].totalAmount = booking.totalAmount ?? 0;
              grouped[bookingId].totalPaid = grouped[bookingId].payments
                .filter((p) => p.status === "SUCCESS")
                .reduce((sum, p) => sum + p.amount, 0);
              grouped[bookingId].remainingAmount = Math.max(
                grouped[bookingId].totalAmount - grouped[bookingId].totalPaid,
                0
              );
              grouped[bookingId].isFullyPaid = grouped[bookingId].totalPaid >= grouped[bookingId].totalAmount;
            } catch (err) {
              console.error(`Failed to fetch booking ${bookingId}`, err);
            }
          })
        );

        setGroupedPayments(Object.values(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    loading,
    payments: groupedPayments, // plain array for smart pagination
  };
};