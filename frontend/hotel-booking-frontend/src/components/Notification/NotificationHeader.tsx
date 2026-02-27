import { CheckCircle } from "lucide-react";
import React from "react";

interface Props {
  onMarkAll: () => void;
}

const NotificationHeader: React.FC<Props> = ({ onMarkAll }) => (
  <div className="flex justify-end mb-6">
    <button
      onClick={onMarkAll}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition transform focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <CheckCircle size={20} />
      Mark All as Read
    </button>
  </div>
);

export default NotificationHeader;