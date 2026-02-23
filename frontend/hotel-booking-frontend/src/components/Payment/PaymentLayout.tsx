import React from "react";

const PaymentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-tr from-pink-100 via-purple-100 to-blue-50 p-6 select-none">
      <div className="w-full max-w-xl p-8 bg-white rounded-3xl shadow-2xl space-y-8">
        {children}
      </div>
    </div>
  );
};

export default PaymentLayout;