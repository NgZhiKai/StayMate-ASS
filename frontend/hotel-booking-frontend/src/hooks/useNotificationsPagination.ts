import { useMemo, useState } from "react";
import { Notification } from "../types/Notification";

interface Props {
  notifications: Notification[];
  itemsPerPage: number;
}

export const useNotificationsPagination = ({
  notifications,
  itemsPerPage,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      if (a.isread === b.isread) {
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
      }
      return a.isread ? 1 : -1;
    });
  }, [notifications]);

  const totalPages = Math.ceil(sortedNotifications.length / itemsPerPage);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedNotifications.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [sortedNotifications, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedNotifications,
    goToPage,
  };
};