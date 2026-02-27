import React, { useEffect, useRef } from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info";
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    else if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  // Modern gradient styling based on type
  const typeStyles = {
    warning: {
      iconBg: "bg-gradient-to-br from-yellow-300 to-yellow-500",
      iconText: "text-yellow-800",
      confirmBtn: "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700",
    },
    danger: {
      iconBg: "bg-gradient-to-br from-red-400 to-red-600",
      iconText: "text-white",
      confirmBtn: "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800",
    },
    info: {
      iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
      iconText: "text-white",
      confirmBtn: "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800",
    },
  }[type];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirmation-modal-title"
      className="fixed inset-0 m-auto w-full max-w-md p-0 border-none rounded-3xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm select-none"
    >
      <div className="relative p-8 bg-white rounded-3xl shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`flex items-center justify-center h-16 w-16 rounded-full mb-4 text-2xl font-bold ${typeStyles.iconBg} ${typeStyles.iconText} shadow-lg`}
          >
            !
          </div>
          <h2
            id="confirmation-modal-title"
            className="text-2xl font-semibold text-gray-900"
          >
            Confirm Action
          </h2>
        </div>

        {/* Message */}
        <div
          className="text-gray-700 text-center text-base mb-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-900 transition shadow-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-3 rounded-lg font-medium text-white transition shadow-md ${typeStyles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;