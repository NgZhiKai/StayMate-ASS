import { useEffect, useState } from "react";
import { bookingApi } from "../services/Booking";
import { hotelApi } from "../services/Hotel";
import { paymentApi } from "../services/Payment";
import { userApi } from "../services/User";
import { GroupedPayment } from "../types/Payment";

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
          const existingGroup = groupsMap[p.bookingId];
          if (existingGroup) {
            existingGroup.totalAmount += p.amount;
            existingGroup.payments.push(p);
            if (new Date(p.transactionDate) > new Date(existingGroup.latestTransactionDate)) {
              existingGroup.latestTransactionDate = p.transactionDate;
              existingGroup.status = p.status; // latest status
            }
            return;
          }

          groupsMap[p.bookingId] = {
            bookingId: p.bookingId,
            totalAmount: p.amount,
            status: p.status,
            latestTransactionDate: p.transactionDate,
            payments: [p],
          };
        });

        const groupedArray = Object.values(groupsMap);

        // Fetch booking details, user info, and hotel name
        const bookingPromises = groupedArray.map(async (g) => {
          const bookingDetails = await bookingApi.fetchBookingById(g.bookingId);

          // Fetch user info
          let user;
          try {
            const userData = await userApi.getUserInfo(bookingDetails.userId.toString());
            user = { firstName: userData.user.firstName, lastName: userData.user.lastName };
          } catch (error) {
            console.error(`Failed to fetch user info for booking ${g.bookingId}:`, error);
            user = { firstName: "Unknown", lastName: "" };
          }

          // Fetch hotel name
          let hotelName = "Unknown";
          try {
            const hotelData = await hotelApi.fetchHotelById(bookingDetails.hotelId);
            hotelName = hotelData.name;
          } catch (error) {
            console.error(`Failed to fetch hotel name for booking ${g.bookingId}:`, error);
            hotelName = "Unknown";
          }

          return { ...g, bookingDetails, user, hotelName };
        });

        const results = await Promise.all(bookingPromises);
        setGroupedPayments(results);
      } catch (error) {
        console.error("Failed to fetch grouped payments:", error);
        setError("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return { groupedPayments, loading, error };
};
