import React, { useState } from "react";
import { useNotificationContext } from "../../contexts/NotificationContext";
import NotificationHeader from "../../components/Notifications/NotificationHeader";
import NotificationList from "../../components/Notifications/NotificationList";
import Pagination from "../../components/Notifications/Pagination";

const ITEMS_PER_PAGE = 6;

const NotificationsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const { notifications, loading, error, markAsRead, markAllAsRead } = useNotificationContext();

  const handleMarkAsRead = async (id: number) => {
    setMarkingId(id);
    await markAsRead(id);
    setMarkingId(null);
  };

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isread === b.isread) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return a.isread ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = sortedNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading) return <div className="flex justify-center items-center h-full text-gray-400">Loading notifications...</div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;

  return (
    <div className="p-6 min-h-full bg-gray-50 select-none">
      <NotificationHeader onMarkAll={markAllAsRead} />
      <NotificationList notifications={currentNotifications} onMarkAsRead={handleMarkAsRead} markingId={markingId} />
      <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
    </div>
  );
};

export default NotificationsPage;