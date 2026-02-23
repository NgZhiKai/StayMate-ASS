import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";
import MessageModal from "../../components/Modal/MessageModal";
import AccountSettingsForm from "../../components/User/AccountSettingsForm";
import { AuthContext } from "../../contexts/AuthContext";
import { userApi } from "../../services/User";

const UserAccountSettings = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; message: string; type: "success" | "error"; }>({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; message: string; onConfirm: () => void; }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch user info
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      const { user } = await userApi.getUserInfo(userId);
      setUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } catch (err) {
      setMessageModal({
        isOpen: true,
        message: err instanceof Error ? err.message : "Failed to load user info.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // ---------------- Name & Phone ----------------
  const handleNamePhoneUpdate = async (firstName: string, lastName: string, phoneNumber: string) => {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) throw new Error("User not logged in.");

      await userApi.updateUser(userId, { ...userInfo, firstName, lastName, phoneNumber });
      setUserInfo((prev) => ({ ...prev, firstName, lastName, phoneNumber }));

      setMessageModal({ isOpen: true, message: "Name and phone updated successfully!", type: "success" });
    } catch (err) {
      setMessageModal({ isOpen: true, message: err instanceof Error ? err.message : "Failed to update name/phone.", type: "error" });
    }
  };

  // ---------------- Email ----------------
  const handleEmailChange = async (email: string) => {
    if (!email.trim()) return;

    const doChange = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in.");

        await userApi.updateUser(userId, { ...userInfo, email });
        setUserInfo((prev) => ({ ...prev, email }));
        setNewEmail("");

        setMessageModal({ isOpen: true, message: "Email updated successfully!", type: "success" });
      } catch (err) {
        setMessageModal({ isOpen: true, message: err instanceof Error ? err.message : "Failed to update email.", type: "error" });
      }
    };

    setConfirmModal({
      isOpen: true,
      message: `Are you sure you want to change your email to <b>${email}</b>?`,
      onConfirm: doChange,
    });
  };

  // ---------------- Password ----------------
  const handlePasswordChange = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return setMessageModal({ isOpen: true, message: "Please fill all password fields.", type: "error" });
    }

    const doChange = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in.");

        await userApi.updateUser(userId, { ...userInfo, password: passwords.newPassword } as any);

        setPasswords({ currentPassword: "", newPassword: "" });
        setMessageModal({ isOpen: true, message: "Password changed successfully!", type: "success" });
      } catch (err) {
        setMessageModal({ isOpen: true, message: err instanceof Error ? err.message : "Failed to change password.", type: "error" });
      }
    };

    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to change your password?",
      onConfirm: doChange,
    });
  };

  // ---------------- Delete Account ----------------
  const handleDeleteAccount = async () => {
    const doDelete = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in.");

        const response = await userApi.deleteUser(userId);
        setMessageModal({ isOpen: true, message: response.message, type: "success" });
        logout();
        navigate("/");
      } catch (err) {
        setMessageModal({ isOpen: true, message: err instanceof Error ? err.message : "Failed to delete account.", type: "error" });
      }
    };

    setConfirmModal({
      isOpen: true,
      message: "Are you sure you want to delete your account? This action cannot be undone.",
      onConfirm: doDelete,
    });
  };

  if (loading) return <div className="text-center mt-10 text-gray-700 text-lg">Loading...</div>;

  return (
    <>
      <div
        className="h-[calc(98vh-4rem)] flex items-center justify-center p-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <AccountSettingsForm
          userInfo={userInfo}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          passwords={passwords}
          setPasswords={setPasswords}
          handleNamePhoneUpdate={handleNamePhoneUpdate}
          handleEmailChange={handleEmailChange}
          handlePasswordChange={handlePasswordChange}
          handleDeleteAccount={handleDeleteAccount}
        />
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
        message={messageModal.message}
        type={messageModal.type}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        }}
        message={confirmModal.message}
      />
    </>
  );
};

export default UserAccountSettings;