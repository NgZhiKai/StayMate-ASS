import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSettingsForm, AccountSettingsLayout } from "../../components/User";
import { ConfirmationModal, MessageModal } from "../../components/Modal";
import { useUserAccount } from "../../hooks/useUserAccount";

const UserAccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const {
    userInfo,
    passwords,
    setPasswords,
    newEmail,
    setNewEmail,
    loading,
    messageModal,
    setMessageModal,
    confirmModal,
    setConfirmModal,
    handleNamePhoneUpdate,
    handleEmailChange,
    handlePasswordChange,
    handleDeleteAccount,
  } = useUserAccount();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (loading) {
    return <div className="text-center mt-10 text-gray-700 text-lg">Loading...</div>;
  }

  // Triggered when user clicks "Delete Account"
  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  // Actually delete after confirming
  const handleConfirmDelete = async () => {
    setIsDeleteConfirmOpen(false);
    const success = await handleDeleteAccount();
    if (success) {
      navigate("/login", { replace: true });
    }
  };

  return (
    <AccountSettingsLayout>
      <AccountSettingsForm
        userInfo={userInfo}
        passwords={passwords}
        setPasswords={setPasswords}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        handleNamePhoneUpdate={handleNamePhoneUpdate}
        handleEmailChange={handleEmailChange}
        handlePasswordChange={handlePasswordChange}
        handleDeleteAccount={handleDeleteClick} // show modal first
      />

      {/* Error / Success message modal */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal(prev => ({ ...prev, isOpen: false }))}
        message={messageModal.message}
        type={messageModal.type}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete your account? This action cannot be undone."
        type="danger"
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      {/* Other confirmation modals can still use confirmModal if needed */}
    </AccountSettingsLayout>
  );
};

export default UserAccountSettings;