import React, { useEffect, useState } from "react";
import { User } from "../../types/User";
import { GridLayout } from "../Layout";
import { MessageModal } from "../Modal";
import DeleteAccountSection from "./DeleteAccountSection";
import EmailSection from "./EmailSection";
import NamePhoneSection from "./NamePhoneSection";
import PasswordSection from "./PasswordSection";

interface Props {
  userInfo: User;
  passwords: { currentPassword: string; newPassword: string };
  setPasswords: React.Dispatch<React.SetStateAction<{ currentPassword: string; newPassword: string }>>;
  newEmail: string;                                  // <-- add this
  setNewEmail: React.Dispatch<React.SetStateAction<string>>; // <-- add this
  handleNamePhoneUpdate: (firstName: string, lastName: string, phoneNumber: string) => void;
  handleEmailChange: (email: string) => void;
  handlePasswordChange: () => void;
  handleDeleteAccount: () => void;
}

const AccountSettingsForm: React.FC<Props> = ({
  userInfo,
  passwords,
  setPasswords,
  newEmail,
  setNewEmail,
  handleNamePhoneUpdate,
  handleEmailChange,
  handlePasswordChange,
  handleDeleteAccount,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<{ [key: string]: boolean }>({ namePhone: false, email: false, password: false, delete: false });

  // sync form state when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setPhoneNumber(userInfo.phoneNumber);
      setNewEmail("");
    }
  }, [userInfo]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };

  const handleUpdateNamePhone = async () => {
    setLoadingAction(prev => ({ ...prev, namePhone: true }));
    try {
      await handleNamePhoneUpdate(firstName, lastName, phoneNumber);
    } catch {
      showError("Failed to update name/phone.");
    }
    setLoadingAction(prev => ({ ...prev, namePhone: false }));
  };

  const handleUpdateEmail = async () => {
    setLoadingAction(prev => ({ ...prev, email: true }));
    try {
      if (newEmail.trim()) {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
        if (!isValidEmail) throw new Error("Invalid email.");
        await handleEmailChange(newEmail);
      }
    } catch (err: any) {
      showError(err.message || "Failed to update email.");
    }
    setLoadingAction(prev => ({ ...prev, email: false }));
  };

  const handleUpdatePassword = async () => {
    setLoadingAction(prev => ({ ...prev, password: true }));
    try {
      if (passwords.newPassword.length < 8) throw new Error("Password must be at least 8 characters.");
      await handlePasswordChange();
    } catch (err: any) {
      showError(err.message || "Failed to change password.");
    }
    setLoadingAction(prev => ({ ...prev, password: false }));
  };

  const handleDelete = async () => {
    setLoadingAction(prev => ({ ...prev, delete: true }));
    try {
      await handleDeleteAccount();
    } catch {
      showError("Failed to delete account.");
    }
    setLoadingAction(prev => ({ ...prev, delete: false }));
  };

  if (!userInfo) return <p>Loading user info...</p>;

  return (
    <>
      <GridLayout columns={2} gap="gap-6">
        <NamePhoneSection
          firstName={firstName}
          lastName={lastName}
          phoneNumber={phoneNumber}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPhoneNumber={setPhoneNumber}
          onUpdate={handleUpdateNamePhone}
          loading={loadingAction.namePhone}
        />

        <EmailSection
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          currentEmail={userInfo.email}
          onUpdate={handleUpdateEmail}
          loading={loadingAction.email}
        />

        <PasswordSection
          passwords={passwords}
          setPasswords={setPasswords}
          onUpdate={handleUpdatePassword}
          loading={loadingAction.password}
        />

        <DeleteAccountSection
          onDelete={handleDelete}
          loading={loadingAction.delete}
        />
      </GridLayout>

      <MessageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} message={errorMessage || ""} type="error" />
    </>
  );
};

export default AccountSettingsForm;