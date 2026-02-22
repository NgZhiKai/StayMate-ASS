import { CreditCard } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getPaymentsByUserId } from "../services/Payment/paymentApi";
import { fetchBookingById } from "../services/Booking/bookingApi";
import { Payment } from "../types/Payment";
import { DetailedBooking } from "../types/Booking";

const ITEMS_PER_PAGE = 3; // pagination by booking groups

interface GroupedPayments {
  bookingId: number;
  payments: Payment[];
  totalAmount?: number;
  totalPaid?: number;
  remainingAmount?: number;
  isFullyPaid?: boolean;
}

const MyPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [groupedPayments, setGroupedPayments] = useState<GroupedPayments[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentsAndBookings = async () => {
      const storedUserId = sessionStorage.getItem("userId");
      if (!storedUserId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const userId = Number(storedUserId);
        const data = await getPaymentsByUserId(userId);
        const paymentsData: Payment[] = Array.isArray(data) ? data : [];

        // group payments by bookingId
        const grouped: Record<number, GroupedPayments> = {};
        for (const payment of paymentsData) {
          if (!grouped[payment.bookingId])
            grouped[payment.bookingId] = { bookingId: payment.bookingId, payments: [] };
          grouped[payment.bookingId].payments.push(payment);
        }

        // fetch booking total amounts
        const bookingIds = Object.keys(grouped).map(Number);
        await Promise.all(
          bookingIds.map(async (bookingId) => {
            try {
              const booking: DetailedBooking = await fetchBookingById(bookingId);
              grouped[bookingId].totalAmount = booking.totalAmount ?? 0;

              // sum successful payments
              grouped[bookingId].totalPaid = grouped[bookingId].payments
                .filter((p) => p.status === "SUCCESS")
                .reduce((sum, p) => sum + p.amount, 0);

              grouped[bookingId].remainingAmount = Math.max(
                (grouped[bookingId].totalAmount ?? 0) - (grouped[bookingId].totalPaid ?? 0),
                0
              );

              grouped[bookingId].isFullyPaid =
                (grouped[bookingId].totalPaid ?? 0) >= (grouped[bookingId].totalAmount ?? 0);
            } catch (err) {
              console.error(`Failed to fetch booking ${bookingId}`, err);
            }
          })
        );

        setPayments(paymentsData);
        setGroupedPayments(Object.values(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentsAndBookings();
  }, []);

  const totalPages = Math.ceil(groupedPayments.length / ITEMS_PER_PAGE);
  const currentGroups = groupedPayments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return "Unknown";
    switch (method) {
      case "CREDIT_CARD":
        return "Credit Card";
      case "PAYPAL":
        return "PayPal";
      case "STRIPE":
        return "Stripe";
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case "CREDIT_CARD":
        return <CreditCard size={16} className="text-pink-400 mr-1" />;
      case "PAYPAL":
        return <span className="mr-1">💰</span>;
      case "STRIPE":
        return <span className="mr-1">💳</span>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "SUCCESS") return "bg-green-200/30 text-green-200";
    if (status === "FAILURE") return "bg-red-200/30 text-red-200";
    return "bg-yellow-200/30 text-yellow-200";
  };

  if (loading)
    return <div className="p-6 text-white text-center">Loading payments...</div>;

  return (
    <div className="min-h-full py-10 px-4 sm:px-6 lg:px-12 bg-gradient-to-tr from-purple-900 via-indigo-900 to-blue-900 select-none">
      <h2 className="text-white text-4xl font-bold text-center mb-10">
        My Payment History
      </h2>

      {groupedPayments.length === 0 ? (
        <p className="text-gray-300 text-center text-lg">No payments found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {currentGroups.map((group) => {
            // group by payment method within booking
            const paymentsByMethod = Object.values(
              group.payments.reduce((acc, p) => {
                const key = p.paymentMethod || "UNKNOWN";
                if (!acc[key]) {
                  acc[key] = { ...p, amount: 0 };
                }
                acc[key].amount += p.amount;
                // determine status for the group: fully success if all success
                acc[key].status =
                  group.payments.filter((pay) => pay.paymentMethod === key && pay.status !== "SUCCESS")
                    .length > 0
                    ? "PENDING"
                    : "SUCCESS";
                return acc;
              }, {} as Record<string, Payment>)
            );

            return (
              <div
                key={group.bookingId}
                className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl hover:scale-105 transition-transform duration-300 text-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard size={28} className="text-pink-400" />
                    <div>
                      <div className="text-lg font-semibold">
                        Booking #{group.bookingId}
                      </div>
                      <div className="text-sm text-gray-300">
                        Total Paid: ${group.totalPaid?.toFixed(2) ?? "0.00"} / $
                        {group.totalAmount?.toFixed(2) ?? "0.00"}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      group.isFullyPaid
                        ? "bg-green-300/30 text-green-300"
                        : "bg-yellow-300/30 text-yellow-300"
                    }`}
                  >
                    {group.isFullyPaid
                      ? "Fully Paid"
                      : `Remaining $${group.remainingAmount?.toFixed(2) ?? "0.00"}`}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {paymentsByMethod.map((payment) => (
                    <div
                      key={payment.paymentMethod || `unknown-${payment.id}`}
                      className="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                    >
                      <div className="flex items-center text-sm">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        {getPaymentMethodLabel(payment.paymentMethod)}
                      </div>
                      <span className="text-sm text-pink-300 text-right">
                        ${payment.amount.toFixed(2)}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full justify-self-end ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {groupedPayments.length > 0 && (
        <div className="flex justify-center mt-8 items-center gap-3">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-full text-white font-medium ${
              currentPage === 1
                ? "bg-gray-400/40 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition"
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 rounded-full text-white font-medium ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-white/20 hover:bg-white/40 transition"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-full text-white font-medium ${
              currentPage === totalPages
                ? "bg-gray-400/40 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition"
            }`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPaymentsPage;