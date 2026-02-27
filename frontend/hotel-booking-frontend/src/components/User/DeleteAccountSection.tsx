import React from "react";
import { GradientButton } from "../Button";
import Section from "./Section";

interface Props {
  onDelete: () => void;
  loading: boolean;
}

const DeleteAccountSection: React.FC<Props> = ({ onDelete, loading }) => (
  <Section title="Delete Account" gradient="from-red-500 to-red-600">
    <GradientButton
      loading={loading}
      onClick={onDelete}
      className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
      gradient="from-red-500 to-red-600"
    >
      Delete Account
    </GradientButton>
  </Section>
);

export default DeleteAccountSection;