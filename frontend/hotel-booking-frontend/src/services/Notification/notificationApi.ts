import { Notification } from "../../types/Notification";
import { notificationApiClient } from "./notificationApiClient";

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

/**
 * Fetch all notifications for a user
 */
export const fetchNotificationsByUserId = async (userId: number): Promise<Notification[]> => {
  const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}`);
  const data = response.data ?? [];
  return data.map(mapNotification);
};

/**
 * Fetch read notifications for a user
 */
export const fetchReadNotificationsByUserId = async (userId: number): Promise<Notification[]> => {
  const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}/read`);
  const data = response.data ?? [];
  return data.map(mapNotification);
};

/**
 * Fetch unread notifications for a user
 */
export const fetchUnreadNotificationsByUserId = async (userId: number): Promise<Notification[]> => {
  const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}/unread`);
  const data = response.data ?? [];
  return data.map(mapNotification);
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: number): Promise<{ message: string }> => {
  const response = await notificationApiClient.put(`${NOTIFICATION_BASE}/${notificationId}/read`);
  if (!response.data?.message) throw new Error("Failed to mark notification as read");
  return response.data;
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: number): Promise<{ message: string }> => {
  const response = await notificationApiClient.put(`${NOTIFICATION_BASE}/user/${userId}/read`);
  if (!response.data?.message) throw new Error("Failed to mark all notifications as read");
  return response.data;
};

/**
 * Fetch notifications by type for a user
 */
export const fetchNotificationsByType = async (userId: number, type: string): Promise<Notification[]> => {
  const response = await notificationApiClient.get(`${NOTIFICATION_BASE}/user/${userId}/type/${type}`);
  const data = response.data ?? [];
  return data.map(mapNotification);
};

/**
 * Send a promotion notification to all users
 */
export const sendPromotionNotificationToAllUsers = async (promotionMessage: string): Promise<{ message: string }> => {
  const response = await notificationApiClient.post(`${NOTIFICATION_BASE}/promotion`, { promotionMessage });
  if (!response.data?.message) throw new Error("Failed to send promotion notification");
  return response.data;
};