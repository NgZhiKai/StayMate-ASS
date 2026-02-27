import { useState, useEffect } from "react";
import { userApi } from "../services/User";
import { User } from "../types/User";

interface MessageModalState {
  isOpen: boolean;
  message: string;
  type: "success" | "error";
}

interface ConfirmModalState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
}

export const useUserAccount = () => {
  const [userInfo, setUserInfo] = useState<User>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<MessageModalState>({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  // fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in.");
        const { user } = await userApi.getUserInfo(userId);
        setUserInfo(user);
      } catch (err: any) {
        setMessageModal({
          isOpen: true,
          message: err.message || "Failed to fetch user.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = async (updates: Partial<User>, successMessage: string) => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");
      const updatedUser = { ...userInfo, ...updates };
      await userApi.updateUser(userId, updatedUser);
      setUserInfo(updatedUser);
      setMessageModal({ isOpen: true, message: successMessage, type: "success" });
    } catch (err: any) {
      setMessageModal({
        isOpen: true,
        message: err.message || "Failed to update user.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNamePhoneUpdate = (firstName: string, lastName: string, phoneNumber: string) =>
    updateUser({ firstName, lastName, phoneNumber }, "Name & phone updated!");

  const handleEmailChange = (email: string) => updateUser({ email }, "Email updated!");

  const handlePasswordChange = async () => {
    if (!passwords.newPassword) return;
    await updateUser({ password: passwords.newPassword } as Partial<User>, "Password changed!");
    setPasswords({ currentPassword: "", newPassword: "" });
  };

  // delete account, return boolean success for page to handle navigation
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("Not logged in");

      await userApi.deleteUser(userId);
      sessionStorage.clear();
      
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    userInfo,
    newEmail,
    setNewEmail,
    passwords,
    setPasswords,
    loading,
    messageModal,
    setMessageModal,
    confirmModal,
    setConfirmModal,
    handleNamePhoneUpdate,
    handleEmailChange,
    handlePasswordChange,
    handleDeleteAccount,
  };
};