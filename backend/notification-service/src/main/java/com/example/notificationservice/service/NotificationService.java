package com.example.notificationservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.entity.NotificationType;
import com.example.notificationservice.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // Create a new notification
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    // Get notifications for a user filtered by read status
    public List<Notification> getNotificationsByUserIdAndReadStatus(Long userId, boolean isRead) {
        return notificationRepository.findByUserIdAndIsRead(userId, isRead);
    }

    // Get notifications for a user filtered by type
    public List<Notification> getNotificationsByUserIdAndType(Long userId, NotificationType type) {
        return notificationRepository.findByUserIdAndType(userId, type);
    }

    // Mark a notification as read
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + notificationId));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return notification;
    }

    // Mark all notification for a user as read
    public void markAllNotificationsAsRead(Long userId) {
        notificationRepository.markAllAsReadByUserId(userId);
    }

}