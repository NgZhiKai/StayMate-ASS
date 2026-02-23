import { CreditCard } from "lucide-react";
import { Payment } from "../../types/Payment";

interface Props {
  payment: Payment;
}

export const PaymentRow: React.FC<Props> = ({ payment }) => {
  const getStatusColor = (status: string) => {
    if (status === "SUCCESS") return "bg-green-200/30 text-green-600";
    if (status === "FAILURE") return "bg-red-200/30 text-red-600";
    return "bg-yellow-200/30 text-yellow-600";
  };

  const getPaymentLabel = (method: string | null) => {
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

  const getPaymentIcon = (method: string | null) => {
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

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
      {/* Payment Method */}
      <div className="flex items-center text-sm gap-2">
        {getPaymentIcon(payment.paymentMethod)}
        {getPaymentLabel(payment.paymentMethod)}
      </div>

      {/* Amount with extra padding */}
      <span className="text-sm text-pink-300 text-right px-3 py-1 rounded-lg">
        ${payment.amount.toFixed(2)}
      </span>

      {/* Status badge with more padding */}
      <span
        className={`text-xs font-bold px-4 py-2 rounded-full justify-self-end ${getStatusColor(
          payment.status
        )}`}
      >
        {payment.status}
      </span>
    </div>
  );
};

export default PaymentRow;