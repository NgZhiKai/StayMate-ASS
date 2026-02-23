import React from "react";
import MessageModal from "./MessageModal";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  modalMessage: string;
  modalType: "success" | "error";
  onSend: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  email,
  setEmail,
  isLoading,
  modalMessage,
  modalType,
  onSend,
}) => {
  return (
    <MessageModal isOpen={isOpen} onClose={onClose} message={modalMessage} type={modalType}>
      {modalType === "error" && (
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 transition"
        />
      )}
      <button
        onClick={onSend}
        disabled={!email.trim() || isLoading}
        className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg transform transition-all ${
          !email.trim() || isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105"
        }`}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </button>
    </MessageModal>
  );
};

export default ForgotPasswordModal;