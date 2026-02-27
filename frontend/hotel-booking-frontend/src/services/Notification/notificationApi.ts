import { Notification } from "../../types/Notification";
import { notificationApiClient } from "./notificationApiClient";
import { handleApiError } from "../../utils/handleApiError";

const NOTIFICATION_BASE = "/notifications";

/**
 * Map API response to Notification interface
 */
const mapNotification = (n: any): Notification => ({
  id: n.id,
  notificationId: n.id,
  userId: n.userId,
  message: n.message,
  type: n.type,
  createdAt: n.createdAt,
  isread: n.read,
});

const notificationApi = {
  fetchByUserId: async (userId: number): Promise<{ notifications: Notification[] }> => {
    try {
      const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}`);
      const data = response.data ?? [];
      return { notifications: data.map(mapNotification) };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  fetchReadByUserId: async (userId: number): Promise<{ notifications: Notification[] }> => {
    try {
      const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}/read`);
      const data = response.data ?? [];
      return { notifications: data.map(mapNotification) };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  fetchUnreadByUserId: async (userId: number): Promise<{ notifications: Notification[] }> => {
    try {
      const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}/unread`);
      const data = response.data ?? [];
      return { notifications: data.map(mapNotification) };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  fetchByType: async (userId: number, type: string): Promise<{ notifications: Notification[] }> => {
    try {
      const response = await notificationApiClient.get(
        `${NOTIFICATION_BASE}/user/${userId}/type/${type}`
      );
      const data = response.data ?? [];
      return { notifications: data.map(mapNotification) };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  markAsRead: async (notificationId: number): Promise<{ message: string }> => {
    try {
      const response = await notificationApiClient.put(`${NOTIFICATION_BASE}/${notificationId}/read`);
      if (!response.data?.message) throw new Error("Failed to mark notification as read");
      return { message: response.data.message };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  markAllAsRead: async (userId: number): Promise<{ message: string }> => {
    try {
      const response = await notificationApiClient.put(`${NOTIFICATION_BASE}/user/${userId}/read`);
      if (!response.data?.message) throw new Error("Failed to mark all notifications as read");
      return { message: response.data.message };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },

  sendPromotionToAll: async (promotionMessage: string): Promise<{ message: string }> => {
    try {
      const response = await notificationApiClient.post(`${NOTIFICATION_BASE}/promotion`, { promotionMessage });
      if (!response.data?.message) throw new Error("Failed to send promotion notification");
      return { message: response.data.message };
    } catch (err: any) {
      throw new Error(handleApiError(err));
    }
  },
};

export default notificationApi;