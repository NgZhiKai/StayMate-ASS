import { CreditCard, Zap, Wallet } from "lucide-react";
import { Payment } from "../../types/Payment";

interface Props {
  payment: Payment;
}

export const PaymentRow: React.FC<Props> = ({ payment }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "FAILURE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getPaymentLabel = (method: string | null) => {
    switch (method) {
      case "CREDIT_CARD":
        return "Credit Card";
      case "PAYPAL":
        return "PayPal";
      case "STRIPE":
        return "Stripe";
      default:
        return method || "Unknown";
    }
  };

  const getPaymentIcon = (method: string | null) => {
    switch (method) {
      case "CREDIT_CARD":
        return <CreditCard size={18} className="text-pink-400 mr-2" />;
      case "PAYPAL":
        return <Wallet size={18} className="text-blue-500 mr-2" />;
      case "STRIPE":
        return <Zap size={18} className="text-purple-400 mr-2" />;
      default:
        return <Wallet size={18} className="text-gray-400 mr-2" />;
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/30 transition duration-200">
      <div className="flex items-center text-sm gap-2 font-medium text-gray-800">
        {getPaymentIcon(payment.paymentMethod)}
        {getPaymentLabel(payment.paymentMethod)}
      </div>
      <span className="text-sm font-semibold text-gray-900 text-right px-3 py-1 rounded-lg">
        ${payment.amount.toFixed(2)}
      </span>
      <span
        className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full justify-self-end ${getStatusColor(payment.status)}`}
      >
        {payment.status}
      </span>
    </div>
  );
};

export default PaymentRow;