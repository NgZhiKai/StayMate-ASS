import React from "react";
import { InputField } from "../Form";
import { GradientButton } from "../Button";
import Section from "./Section";

interface Props {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  setFirstName: (val: string) => void;
  setLastName: (val: string) => void;
  setPhoneNumber: (val: string) => void;
  onUpdate: () => void;
  loading: boolean;
}

const NamePhoneSection: React.FC<Props> = ({
  firstName,
  lastName,
  phoneNumber,
  setFirstName,
  setLastName,
  setPhoneNumber,
  onUpdate,
  loading,
}) => (
  <Section title="Name & Phone" gradient="from-green-500 to-teal-500">
    <InputField
      type="text"
      name="firstName"
      value={firstName}
      onChange={(e) => setFirstName(e.target.value)}
      placeholder="First Name"
    />
    <InputField
      type="text"
      name="lastName"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      placeholder="Last Name"
    />
    <InputField
      type="text"
      name="phoneNumber"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
      placeholder="Phone Number"
    />
    <GradientButton
      loading={loading}
      onClick={onUpdate}
      className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
      gradient="from-green-500 to-teal-500"
    >
      Update Name & Phone
    </GradientButton>
  </Section>
);

export default NamePhoneSection;