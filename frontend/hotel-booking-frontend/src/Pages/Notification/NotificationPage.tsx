import React from "react";
import { LoadingSpinner } from "../../components/Misc";
import {
  NotificationHeader,
  NotificationLayout,
  NotificationList,
  NotificationPagination,
} from "../../components/Notification";
import { useNotificationContext } from "../../contexts/NotificationContext";
import { useMarkNotification, useSmartPagination } from "../../hooks";
import { Notification } from "../../types/Notification";

const ITEMS_PER_PAGE = 6;

const NotificationsPage: React.FC = () => {
  const { notifications, loading, error, markAsRead, markAllAsRead } =
    useNotificationContext();

  // sort notifications by read + date
  const sortedNotifications: Notification[] = [...notifications].sort(
    (a, b) => {
      if (a.isread === b.isread) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return a.isread ? 1 : -1;
    }
  );

  const { currentPage, totalPages, paginatedData, goToPage, pages } =
    useSmartPagination<Notification>({
      data: sortedNotifications,
      itemsPerPage: ITEMS_PER_PAGE,
    });

  const { markingId, handleMarkAsRead } = useMarkNotification(markAsRead);

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-full text-red-500">
        {error}
      </div>
    );

  return (
    <NotificationLayout>
      <NotificationHeader onMarkAll={markAllAsRead} />
      <NotificationList
        key={currentPage} // triggers animation
        notifications={paginatedData}
        onMarkAsRead={handleMarkAsRead}
        markingId={markingId}
        className="animate-fadeIn"
      />
      <NotificationPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pages={pages}
        goToPage={goToPage}
      />
    </NotificationLayout>
  );
};

export default NotificationsPage;