import React from "react";

interface Props {
  fields: any;
  setFields: (fields: any) => void;
}

export const CreditCardForm: React.FC<Props> = ({ fields, setFields }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800">Card Details</h3>
    <input
      type="text"
      placeholder="Card Number"
      value={fields.cardNumber}
      onChange={(e) => setFields({ ...fields, cardNumber: e.target.value })}
      className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="grid grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="MM/YY"
        value={fields.expiry}
        onChange={(e) => setFields({ ...fields, expiry: e.target.value })}
        className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        placeholder="CVV"
        value={fields.cvv}
        onChange={(e) => setFields({ ...fields, cvv: e.target.value })}
        className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);