import React, { useEffect, useRef } from "react";

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
  children?: React.ReactNode;
};

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  message,
  type,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isSuccess = type === "success";

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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      className="fixed inset-0 m-auto w-full max-w-md p-0 border-none rounded-2xl shadow-2xl
        backdrop:bg-black/50 backdrop:backdrop-blur-sm select-none"
    >
      <div
        className={`relative p-8 bg-white border ${
          isSuccess ? "border-green-400/40" : "border-red-400/40"
        } rounded-2xl flex flex-col items-center text-center gap-6`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        {/* Icon */}
        <div
          className={`flex items-center justify-center h-16 w-16 rounded-full text-2xl font-bold
            ${isSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
        >
          {isSuccess ? "✓" : "!"}
        </div>

        {/* Header */}
        <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">
          {isSuccess ? "Success" : "Oops!"}
        </h2>

        {/* Message */}
        <div
          className="text-gray-700 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* Children (optional input/forms) */}
        {children && <div className="w-full">{children}</div>}

        {/* Action */}
        {!children && (
          <button
            onClick={onClose}
            className={`mt-2 px-8 py-3 rounded-xl font-semibold text-white transition-all 
              ${isSuccess ? "bg-gradient-to-r from-green-500 to-green-600 hover:scale-105" : 
              "bg-gradient-to-r from-red-500 to-red-600 hover:scale-105"}`}
          >
            Got it
          </button>
        )}
      </div>
    </dialog>
  );
};

export default MessageModal;