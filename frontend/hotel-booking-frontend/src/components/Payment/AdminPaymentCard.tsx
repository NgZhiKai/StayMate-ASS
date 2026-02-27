import { CreditCard, User, Hotel, CalendarCheck, CalendarX } from "lucide-react";
import React from "react";
import { GroupedPayment } from "../../types/Payment";

interface Props {
  group: GroupedPayment;
  formatDate: (dateString: string) => string;
}

export const AdminPaymentCard: React.FC<Props> = ({ group, formatDate }) => {
  const booking = group.bookingDetails;

  const statusColor =
    group.status === "SUCCESS"
      ? "bg-green-200 text-green-900"
      : group.status === "FAILURE"
      ? "bg-red-200 text-red-900"
      : "bg-yellow-200 text-yellow-900";

  return (
    <div className="flex flex-col p-3 bg-white/30 backdrop-blur-sm rounded-2xl shadow hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 gap-2">
      
      {/* Top Row: Icon, Booking ID & Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-full shadow flex items-center justify-center">
            <CreditCard size={20} className="text-white drop-shadow" />
          </div>
          <span className="font-semibold text-gray-900 text-sm truncate">
            Booking #{group.bookingId}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
          {group.status}
        </span>
      </div>

      {/* Amount & Latest Transaction */}
      <div className="flex justify-between items-center text-sm text-gray-800">
        <span>Total: ${group.totalAmount.toFixed(2)}</span>
        <span className="text-gray-600">{formatDate(group.latestTransactionDate)}</span>
      </div>

      {/* Booking Info */}
      {booking && (
        <ul className="flex flex-col gap-1 text-gray-700 text-xs">
          <li className="flex items-center gap-1">
            <CalendarCheck size={14} className="text-gray-500" />
            <span><strong>Check-In:</strong> {formatDate(booking.checkInDate)}</span>
          </li>
          <li className="flex items-center gap-1">
            <CalendarX size={14} className="text-gray-500" />
            <span><strong>Check-Out:</strong> {formatDate(booking.checkOutDate)}</span>
          </li>
          <li className="flex items-center gap-1">
            <User size={14} className="text-gray-500" />
            <span><strong>User:</strong> {group.user?.firstName || "Unknown"} {group.user?.lastName || ""}</span>
          </li>
          <li className="flex items-center gap-1">
            <Hotel size={14} className="text-gray-500" />
            <span><strong>Hotel:</strong> {group.hotelName || "Unknown"}</span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default AdminPaymentCard;