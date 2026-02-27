import { parsePhoneNumberFromString } from "libphonenumber-js";

export const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";

  const phoneNumber = parsePhoneNumberFromString(phone);

  if (!phoneNumber) return phone;

  // Format with international spacing
  const international = phoneNumber.formatInternational(); // "+65 9123 4567"

  // Add brackets around country code
  const countryCode = `+${phoneNumber.countryCallingCode}`;
  const restNumber = international.replace(countryCode, "").trim();

  return `(${countryCode}) ${restNumber}`;
};