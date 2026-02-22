import React from "react";

interface BookingSummaryCardProps {
  total: number;
  paid: number;
  outstanding: number;
}

const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({ total, paid, outstanding }) => (
  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl shadow-inner border border-gray-200">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">Booking Summary</h3>
    <div className="grid grid-cols-2 gap-y-2 text-gray-700">
      <div>Total Amount:</div>
      <div className="font-medium">${total.toFixed(2)}</div>
      <div>Already Paid:</div>
      <div className="font-medium">${paid.toFixed(2)}</div>
      <div className="text-red-600 font-semibold">Outstanding:</div>
      <div className="text-red-600 font-semibold">${outstanding.toFixed(2)}</div>
    </div>
  </div>
);

export default BookingSummaryCard;