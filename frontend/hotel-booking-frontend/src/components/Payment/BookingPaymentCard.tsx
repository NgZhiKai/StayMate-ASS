import { GroupedPayments, Payment } from "../../types/Payment";
import { PaymentRow } from "./PaymentRow";

interface Props {
  group: GroupedPayments;
}

export const BookingPaymentCard: React.FC<Props> = ({ group }) => {
  const paymentsByMethod = Object.values(
    group.payments.reduce<Record<string, Payment>>((acc, p) => {
      const key = p.paymentMethod || "UNKNOWN";

      if (!acc[key]) {
        acc[key] = { ...p, amount: 0 };
      }

      acc[key].amount += p.amount;
      return acc;
    }, {})
  );

  return (
    <div className="p-4 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{`Booking #${group.bookingId}`}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Total Paid: <span className="font-medium text-gray-800">${group.totalPaid.toFixed(2)}</span> / ${group.totalAmount.toFixed(2)}
          </div>
        </div>
        <div
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            group.isFullyPaid
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {group.isFullyPaid
            ? "Fully Paid"
            : `Remaining $${group.remainingAmount.toFixed(2)}`}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300/40 mb-3" />

      {/* Payment timeline */}
      <div className="flex flex-col gap-2 relative">
        {paymentsByMethod.map((payment, idx) => (
          <div key={payment.paymentMethod ?? payment.id} className="relative pl-5">
            {/* Vertical timeline line */}
            {idx !== paymentsByMethod.length - 1 && (
              <span className="absolute left-1.5 top-5 h-full w-0.5 bg-gray-400/50"></span>
            )}
            <PaymentRow payment={payment} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPaymentCard;