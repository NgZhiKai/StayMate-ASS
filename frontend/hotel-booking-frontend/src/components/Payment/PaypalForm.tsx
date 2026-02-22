import React from "react";

interface Props {
  fields: any;
  setFields: (fields: any) => void;
}

export const PaypalForm: React.FC<Props> = ({ fields, setFields }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-2">PayPal Email</label>
    <input
      type="email"
      placeholder="Enter your PayPal email"
      value={fields.paypalEmail}
      onChange={(e) => setFields({ ...fields, paypalEmail: e.target.value })}
      className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);