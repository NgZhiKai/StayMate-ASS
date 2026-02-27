import { Bell, CheckCircle } from "lucide-react";
import React from "react";

interface Notification {
  notificationId: number;
  message: string;
  isread: boolean;
  createdAt: string;
}

interface Props {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  markingId: number | null;
}

const NotificationItem: React.FC<Props> = ({ notification, onMarkAsRead, markingId }) => (
  <li
    className={`flex items-center gap-3 p-3 rounded-2xl shadow-md hover:shadow-lg transition bg-white
      ${notification.isread ? "opacity-80" : "border-l-4 border-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"}
    `}
  >
    <div className="flex-shrink-0">
      <Bell
        size={20}
        className={`${!notification.isread ? "text-indigo-500 animate-pulse" : "text-gray-400"}`}
      />
    </div>

    <div className="flex-1 flex flex-col justify-center">
      <p className="text-gray-900 font-medium text-sm">{notification.message}</p>
      <p className="text-gray-500 text-xs mt-0.5">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>

    {!notification.isread && (
      <button
        onClick={() => onMarkAsRead(notification.notificationId)}
        disabled={markingId === notification.notificationId}
        className="text-green-500 hover:text-green-400 disabled:opacity-50 transition flex-shrink-0"
        aria-label="Mark as read"
      >
        <CheckCircle size={18} />
      </button>
    )}
  </li>
);

export default NotificationItem;