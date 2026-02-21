import { Bell, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";

const ITEMS_PER_PAGE = 6;

const NotificationsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotificationContext();

  const handleMarkAsRead = async (notificationId: number) => {
    setMarkingId(notificationId);
    await markAsRead(notificationId);
    setMarkingId(null);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isread === b.isread) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isread ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = sortedNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-gray-400">
        Loading notifications...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all transform focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <CheckCircle size={20} />
          Mark All as Read
        </button>
      </div>

      {currentNotifications.length === 0 ? (
        <div className="text-gray-500 text-center mt-20 text-sm">
          You have no notifications.
        </div>
      ) : (
        <ul className="space-y-4">
          {currentNotifications.map((notification) => (
            <li
              key={notification.notificationId}
              className={`flex items-start gap-4 p-4 rounded-lg shadow hover:shadow-lg transition bg-white ${
                notification.isread ? "opacity-70" : "border-l-4 border-blue-500"
              }`}
            >
              <div className="relative">
                <Bell
                  size={20}
                  className={`text-gray-400 ${
                    !notification.isread ? "text-blue-500 animate-pulse" : ""
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{notification.message}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isread && (
                <button
                  onClick={() => handleMarkAsRead(notification.notificationId)}
                  disabled={markingId === notification.notificationId}
                  className="text-green-500 hover:text-green-400 disabled:opacity-50 transition"
                  aria-label="Mark as read"
                >
                  <CheckCircle size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;