import { Payment } from "../../types/Payment";
import { GroupedPayments } from "../../hooks/useMyPayments";
import { PaymentRow } from "./PaymentRow";

interface Props {
  group: GroupedPayments;
}

export const BookingPaymentCard: React.FC<Props> = ({ group }) => {
  // Group payments by paymentMethod
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
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl hover:scale-105 transition-transform duration-300">
      <div className="flex justify-between mb-4 items-center">
        <div>
          <div className="text-lg font-semibold text-white">
            Booking #{group.bookingId}
          </div>
          <div className="text-sm text-gray-300">
            Total Paid: ${group.totalPaid.toFixed(2)} / ${group.totalAmount.toFixed(2)}
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
            : `Remaining $${group.remainingAmount.toFixed(2)}`}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {paymentsByMethod.map((payment) => (
          <PaymentRow
            key={payment.paymentMethod ?? payment.id}
            payment={payment}
          />
        ))}
      </div>
    </div>
  );
};

export default BookingPaymentCard;