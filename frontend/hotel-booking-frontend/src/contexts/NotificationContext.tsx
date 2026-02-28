import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { notificationApi } from "../services/Notification";
import { Notification } from "../types/Notification";

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationContext not available");
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUserId = (): number | null => {
    const storedUserId = sessionStorage.getItem("userId");
    return storedUserId ? Number(storedUserId) : null;
  };

  const refreshNotifications = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setNotifications([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await notificationApi.fetchByUserId(userId);
      setNotifications(data.notifications);
    } catch (err: any) {
      setNotifications([]);
      setError(err.message || "Failed to fetch notifications.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsReadContext = useCallback(async (notificationId: number) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in.");

    try {
      await notificationApi.markAsRead(notificationId);
      await refreshNotifications();
    } catch (err: any) {
      setError(err.message || "Failed to mark notification as read.");
      throw err;
    }
  }, [refreshNotifications]);

  const markAllAsReadContext = useCallback(async () => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in.");

    try {
      await notificationApi.markAllAsRead(userId);
      await refreshNotifications();
    } catch (err: any) {
      setError(err.message || "Failed to mark all notifications as read.");
      throw err;
    }
  }, [refreshNotifications]);

  useEffect(() => {
    refreshNotifications().catch((err) => console.error("Notification fetch error:", err));
  }, [refreshNotifications]);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    notifications,
    loading,
    error,
    refreshNotifications,
    markAsRead: markAsReadContext,
    markAllAsRead: markAllAsReadContext,
  }), [notifications, loading, error, refreshNotifications, markAsReadContext, markAllAsReadContext]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
