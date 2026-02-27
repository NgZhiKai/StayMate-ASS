import React from "react";
import { InputField } from "../Form";
import { GradientButton } from "../Button";
import Section from "./Section";

interface Props {
  newEmail: string;
  setNewEmail: (val: string) => void;
  currentEmail: string;
  onUpdate: () => void;
  loading: boolean;
}

const EmailSection: React.FC<Props> = ({
  newEmail,
  setNewEmail,
  currentEmail,
  onUpdate,
  loading,
}) => (
  <Section title="Email" gradient="from-indigo-500 via-purple-500 to-pink-500">
    <InputField
      type="email"
      name="email"
      value={newEmail}
      onChange={(e) => setNewEmail(e.target.value)}
      placeholder="Enter new email"
    />
    <GradientButton
      loading={loading}
      onClick={onUpdate}
      className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
      gradient="from-indigo-500 via-purple-500 to-pink-500"
    >
      Update Email
    </GradientButton>
    <p className="text-gray-500 text-sm mt-1">Current email: {currentEmail}</p>
  </Section>
);

export default EmailSection;