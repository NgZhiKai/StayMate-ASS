import React from "react";
import { InputField } from "../Form";
import { GradientButton } from "../Button";
import Section from "./Section";

interface Props {
  passwords: { currentPassword: string; newPassword: string };
  setPasswords: React.Dispatch<React.SetStateAction<{ currentPassword: string; newPassword: string }>>;
  onUpdate: () => void;
  loading: boolean;
}

const PasswordSection: React.FC<Props> = ({ passwords, setPasswords, onUpdate, loading }) => (
  <Section title="Password" gradient="from-purple-500 to-pink-500">
    <InputField
      type="password"
      name="currentPassword"
      value={passwords.currentPassword}
      onChange={(e) =>
        setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))
      }
      placeholder="Current password"
    />
    <InputField
      type="password"
      name="newPassword"
      value={passwords.newPassword}
      onChange={(e) =>
        setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
      }
      placeholder="New password"
    />
    <GradientButton
      loading={loading}
      onClick={onUpdate}
      className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
      gradient="from-purple-500 to-pink-500"
    >
      Change Password
    </GradientButton>
  </Section>
);

export default PasswordSection;