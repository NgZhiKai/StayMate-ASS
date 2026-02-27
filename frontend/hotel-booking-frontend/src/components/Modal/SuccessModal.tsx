import React, { useEffect } from "react";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  duration?: number; // in ms
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  message,
  onClose,
  duration = 2000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm text-center shadow-xl animate-fade-in">
        <div className="flex flex-col items-center gap-4">
          {/* Animated checkmark */}
          <svg
            className="w-16 h-16 text-green-500 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800">{message}</h3>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;