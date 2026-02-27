import React from "react";

interface Props {
  fields: { stripeToken?: string };
  setFields: (fields: any) => void;
}

export const StripeForm: React.FC<Props> = ({ fields, setFields }) => {
  const stripeToken = fields.stripeToken || "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, stripeToken: e.target.value });
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">Stripe Token</label>
      <input
        type="text"
        placeholder="Enter Stripe token"
        value={stripeToken}
        onChange={handleChange}
        className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};