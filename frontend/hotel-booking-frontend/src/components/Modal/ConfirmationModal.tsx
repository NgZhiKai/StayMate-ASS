import React, { useEffect, useRef } from "react";

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string; // custom confirm button text
  cancelText?: string;  // custom cancel button text
  type?: "warning" | "danger" | "info"; // optional styling variant
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

  // Open/close the dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle escape key / cancel
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

  // Determine colors based on type
  const typeStyles = {
    warning: { bg: "bg-yellow-100", text: "text-yellow-600", button: "bg-yellow-600 hover:bg-yellow-700" },
    danger: { bg: "bg-red-100", text: "text-red-600", button: "bg-red-600 hover:bg-red-700" },
    info: { bg: "bg-blue-100", text: "text-blue-600", button: "bg-blue-600 hover:bg-blue-700" },
  }[type];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirmation-modal-title"
      className="fixed inset-0 m-auto w-full max-w-md p-0 border-none rounded-2xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-8 bg-white border border-gray-300 rounded-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className={`flex items-center justify-center h-14 w-14 rounded-full mb-4 text-xl font-bold ${typeStyles.bg} ${typeStyles.text}`}
          >
            !
          </div>
          <h2 id="confirmation-modal-title" className="text-xl font-semibold text-gray-900">
            Confirm Action
          </h2>
        </div>

        {/* Message */}
        <div
          className="text-gray-800 text-base leading-relaxed text-center mb-8"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-900 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2.5 rounded-lg font-medium text-white transition ${typeStyles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;