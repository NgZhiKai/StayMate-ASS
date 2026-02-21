import React, { useEffect, useRef } from "react";

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
};

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  message,
  type,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isSuccess = type === "success";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
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
      className="
        fixed inset-0 m-auto
        w-full max-w-md
        p-0 border-none rounded-2xl shadow-2xl
        backdrop:bg-black/50 backdrop:backdrop-blur-sm
      "
    >
      <div
        className={`relative p-8 bg-white 
        border ${isSuccess ? "border-green-400/40" : "border-red-400/40"} 
        rounded-2xl`}
      >
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
            className={`flex items-center justify-center h-14 w-14 rounded-full mb-4 text-xl font-bold
              ${
                isSuccess
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            aria-hidden="true"
          >
            {isSuccess ? "✓" : "!"}
          </div>

          <h2
            id="modal-title"
            className="text-xl font-semibold text-gray-900"
          >
            {isSuccess ? "Success" : "Error"}
          </h2>
        </div>

        {/* Message */}
        <div
          className="text-gray-800 text-base leading-relaxed text-center mb-8"
          dangerouslySetInnerHTML={{ __html: message }}
        />

        {/* Action */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-lg font-medium transition
              ${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
          >
            Got it
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default MessageModal;