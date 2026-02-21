import React, { useState, useEffect } from "react";
import MessageModal from "../Modal/MessageModal";

type AccountSettingsFormProps = {
  userInfo: { firstName: string; lastName: string; email: string; phoneNumber: string; role: string };
  newEmail: string;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  passwords: { currentPassword: string; newPassword: string };
  setPasswords: React.Dispatch<React.SetStateAction<{ currentPassword: string; newPassword: string }>>;
  handleNamePhoneUpdate: (firstName: string, lastName: string, phoneNumber: string) => void;
  handleEmailChange: (email: string) => void;
  handlePasswordChange: () => void;
  handleDeleteAccount: () => void;
};

const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
  userInfo,
  newEmail,
  setNewEmail,
  passwords,
  setPasswords,
  handleNamePhoneUpdate,
  handleEmailChange,
  handlePasswordChange,
  handleDeleteAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber || "");

  useEffect(() => {
    setFirstName(userInfo.firstName || "");
    setLastName(userInfo.lastName || "");
    setPhoneNumber(userInfo.phoneNumber || "");
  }, [userInfo]);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => password.length >= 8;

  // ---------------- Name & Phone ----------------
  const handleNamePhoneSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await handleNamePhoneUpdate(firstName, lastName, phoneNumber);
    } catch {
      setErrorMessage("Failed to update name/phone. Please try again.");
      setIsModalOpen(true);
    }
    setLoading(false);
  };

  // ---------------- Email ----------------
  const handleEmailSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (newEmail.trim() && !isValidEmail(newEmail)) {
      setErrorMessage("Please enter a valid email address.");
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      if (newEmail.trim()) await handleEmailChange(newEmail);
    } catch {
      setErrorMessage("Failed to update email. Please try again.");
      setIsModalOpen(true);
    }

    setNewEmail("");
    setLoading(false);
  };

  // ---------------- Password ----------------
  const handlePasswordSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (!isValidPassword(passwords.newPassword)) {
      setErrorMessage("Password must be at least 8 characters long.");
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      await handlePasswordChange();
    } catch {
      setErrorMessage("Failed to change password. Please try again.");
      setIsModalOpen(true);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Account Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---------------- Name & Phone ---------------- */}
        <div className="space-y-2 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-sm font-medium">Name & Phone</p>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button
            onClick={handleNamePhoneSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm hover:from-green-600 hover:to-teal-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Name & Phone"}
          </button>
        </div>

        {/* ---------------- Email ---------------- */}
        <div className="space-y-2 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-sm font-medium">Email</p>
          <input
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <button
            onClick={handleEmailSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Email"}
          </button>
          <p className="text-gray-500 text-sm mt-1">Current email: {userInfo.email}</p>
        </div>

        {/* ---------------- Password ---------------- */}
        <div className="space-y-2 p-4 border border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 text-sm font-medium">Password</p>
          <input
            type="password"
            placeholder="Current password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          />
          <button
            onClick={handlePasswordSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>

        {/* ---------------- Delete Account ---------------- */}
        <div className="space-y-2 p-4 border border-red-300 rounded-xl bg-red-50 text-center">
          <p className="text-red-600 text-sm font-medium">Delete Account</p>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg text-sm hover:from-red-600 hover:to-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={errorMessage || ""}
        type="error"
      />
    </div>
  );
};

export default AccountSettingsForm;