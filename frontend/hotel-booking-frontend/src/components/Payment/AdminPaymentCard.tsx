import { CreditCard } from "lucide-react";
import React from "react";
import { GroupedPayment } from "../../hooks/useGroupedPayments";

interface Props {
  group: GroupedPayment;
  formatDate: (dateString: string) => string;
}

export const AdminPaymentCard: React.FC<Props> = ({ group, formatDate }) => {
  const booking = group.bookingDetails;

  return (
    <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between gap-6 hover:scale-[1.02] transition-transform duration-300">
      {/* Left Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="bg-white/20 p-4 rounded-full shadow-md flex items-center justify-center">
          <CreditCard size={28} className="text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-white/90 text-lg">
            Booking #{group.bookingId}
          </span>
          <span className="text-white/80">
            Total: <strong>${group.totalAmount.toFixed(2)}</strong>
          </span>
          <span className="flex items-center gap-2 text-sm">
            Status:
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                group.status === "SUCCESS"
                  ? "bg-green-200 text-green-900"
                  : group.status === "FAILURE"
                  ? "bg-red-200 text-red-900"
                  : "bg-yellow-200 text-yellow-900"
              }`}
            >
              {group.status}
            </span>
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col md:items-end gap-1 text-white/80 text-sm md:text-base">
        <span className="text-white/90 font-medium">
          {formatDate(group.latestTransactionDate)}
        </span>
        {booking && (
          <div className="mt-2 md:text-right text-xs md:text-sm space-y-1">
            <p>
              <strong>Check-In:</strong> {formatDate(booking.checkInDate)}
            </p>
            <p>
              <strong>Check-Out:</strong> {formatDate(booking.checkOutDate)}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {group.user?.firstName || "Unknown"} {group.user?.lastName || ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};