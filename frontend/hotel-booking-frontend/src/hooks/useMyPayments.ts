import { useEffect, useState } from "react";
import { bookingApi } from "../services/Booking";
import { paymentApi } from "../services/Payment";
import { DetailedBooking } from "../types/Booking";
import { GroupedPayments, Payment } from "../types/Payment";

const createInitialGroup = (bookingId: number): GroupedPayments => ({
  bookingId,
  payments: [],
  totalAmount: 0,
  totalPaid: 0,
  remainingAmount: 0,
  isFullyPaid: false,
});

const groupPaymentsByBookingId = (paymentsData: Payment[]): Record<number, GroupedPayments> => {
  const grouped: Record<number, GroupedPayments> = {};
  for (const payment of paymentsData) {
    if (!grouped[payment.bookingId]) {
      grouped[payment.bookingId] = createInitialGroup(payment.bookingId);
    }
    grouped[payment.bookingId].payments.push(payment);
  }
  return grouped;
};

const calculateTotalPaid = (payments: Payment[]): number => {
  let totalPaid = 0;
  for (const payment of payments) {
    if (payment.status === "SUCCESS") {
      totalPaid += payment.amount;
    }
  }
  return totalPaid;
};

const applyBookingTotals = (group: GroupedPayments, booking: DetailedBooking): void => {
  group.totalAmount = booking.totalAmount ?? 0;
  group.totalPaid = calculateTotalPaid(group.payments);
  group.remainingAmount = Math.max(group.totalAmount - group.totalPaid, 0);
  group.isFullyPaid = group.totalPaid >= group.totalAmount;
};

const enrichGroupedPaymentsWithBookings = async (
  grouped: Record<number, GroupedPayments>
): Promise<void> => {
  const bookingIds = Object.keys(grouped).map(Number);
  const tasks: Promise<void>[] = [];

  for (const bookingId of bookingIds) {
    const task = (async () => {
      try {
        const booking: DetailedBooking = await bookingApi.fetchBookingById(bookingId);
        applyBookingTotals(grouped[bookingId], booking);
      } catch (err) {
        console.error(`Failed to fetch booking ${bookingId}`, err);
      }
    })();
    tasks.push(task);
  }

  await Promise.all(tasks);
};

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
        const grouped = groupPaymentsByBookingId(paymentsData);
        await enrichGroupedPaymentsWithBookings(grouped);

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
