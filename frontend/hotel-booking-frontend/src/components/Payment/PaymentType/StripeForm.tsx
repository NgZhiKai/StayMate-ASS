import React from "react";

interface Props {
  fields: { stripeToken?: string };
  setFields: (fields: any) => void;
}

export const StripeForm: React.FC<Props> = ({ fields, setFields }) => {
  const stripeToken = fields.stripeToken || "";
  const stripeTokenInputId = "stripe-token";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, stripeToken: e.target.value });
  };

  return (
    <div>
      <label htmlFor={stripeTokenInputId} className="block text-gray-700 font-medium mb-2">
        Stripe Token
      </label>
      <input
        id={stripeTokenInputId}
        type="text"
        placeholder="Enter Stripe token"
        value={stripeToken}
        onChange={handleChange}
        className="w-full p-4 bg-gray-100 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
