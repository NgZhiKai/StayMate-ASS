import React from "react";
import NotificationItem from "./NotificationItem";

interface Notification {
  notificationId: number;
  message: string;
  isread: boolean;
  createdAt: string;
}

interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  markingId: number | null;
}

const NotificationList: React.FC<Props> = ({ notifications, onMarkAsRead, markingId }) => {
  if (notifications.length === 0) {
    return <div className="text-gray-500 text-center mt-20 text-sm">You have no notifications.</div>;
  }

  return (
    <ul className="space-y-4">
      {notifications.map((n) => (
        <NotificationItem
          key={n.notificationId}
          notification={n}
          onMarkAsRead={onMarkAsRead}
          markingId={markingId}
        />
      ))}
    </ul>
  );
};

export default NotificationList;