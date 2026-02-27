import React from "react";

interface Props {
  fields: { cardNumber?: string; expiry?: string; cvv?: string };
  setFields: (fields: any) => void;
}

export const CreditCardForm: React.FC<Props> = ({ fields, setFields }) => {
  const cardNumber = fields.cardNumber || "";
  const expiry = fields.expiry || "";
  const cvv = fields.cvv || "";

  const handleChange = (key: string, value: string) => {
    setFields({ ...fields, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Card Details</h3>
      <input
        type="text"
        placeholder="Card Number"
        value={cardNumber}
        onChange={(e) => handleChange("cardNumber", e.target.value)}
        className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="MM/YY"
          value={expiry}
          onChange={(e) => handleChange("expiry", e.target.value)}
          className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="CVV"
          value={cvv}
          onChange={(e) => handleChange("cvv", e.target.value)}
          className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};