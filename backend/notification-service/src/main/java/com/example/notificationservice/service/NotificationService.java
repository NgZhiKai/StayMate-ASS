package com.example.notificationservice.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.notificationservice.client.UserClient;
import com.example.notificationservice.dto.NotificationRequestDTO;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.entity.NotificationType;
import com.example.notificationservice.exception.NotificationNotFoundException;
import com.example.notificationservice.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserClient userClient;

    public NotificationService(NotificationRepository notificationRepository, UserClient userClient) {
        this.notificationRepository = notificationRepository;
        this.userClient = userClient;
    }

    // Create a new notification
    public Notification createNotification(NotificationRequestDTO request) {
        validateCreateRequest(request);
        Notification notification = buildNotification(
                request.getUserId(),
                request.getMessage().trim(),
                request.getType());
        return notificationRepository.save(notification);
    }

    // Get all notifications for a user
    public List<Notification> getNotificationsByUserId(Long userId) {
        validateUserId(userId);
        return notificationRepository.findByUserId(userId);
    }

    // Get notifications for a user filtered by read status
    public List<Notification> getNotificationsByUserIdAndReadStatus(Long userId, boolean isRead) {
        validateUserId(userId);
        return notificationRepository.findByUserIdAndIsRead(userId, isRead);
    }

    // Get notifications for a user filtered by type
    public List<Notification> getNotificationsByUserIdAndType(Long userId, NotificationType type) {
        validateUserId(userId);
        if (type == null) {
            throw new IllegalArgumentException("Notification type must not be null.");
        }
        return notificationRepository.findByUserIdAndType(userId, type);
    }

    // Mark a notification as read
    @Transactional
    public Notification markAsRead(Long notificationId) {
        validateNotificationId(notificationId);
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException("Notification not found with ID: " + notificationId));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);
        }
        return notification;
    }

    // Mark all notification for a user as read
    @Transactional
    public int markAllNotificationsAsRead(Long userId) {
        validateUserId(userId);
        return notificationRepository.markAllAsReadByUserId(userId);
    }

    @Transactional
    public int sendPromotionNotifications(String message) {
        if (!StringUtils.hasText(message)) {
            throw new IllegalArgumentException("Promotion message must not be blank.");
        }

        List<Long> userIds = userClient.getAllUserIds();
        if (userIds.isEmpty()) {
            return 0;
        }

        List<Notification> notifications = userIds.stream()
                .map(userId -> buildNotification(userId, message.trim(), NotificationType.PROMOTION))
                .toList();
        notificationRepository.saveAll(notifications);
        return notifications.size();
    }

    private Notification buildNotification(Long userId, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        return notification;
    }

    private void validateCreateRequest(NotificationRequestDTO request) {
        if (request == null) {
            throw new IllegalArgumentException("Notification payload must not be null.");
        }
        validateUserId(request.getUserId());
        if (!StringUtils.hasText(request.getMessage())) {
            throw new IllegalArgumentException("Notification message must not be blank.");
        }
        if (request.getType() == null) {
            throw new IllegalArgumentException("Notification type must not be null.");
        }
    }

    private void validateUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number.");
        }
    }

    private void validateNotificationId(Long notificationId) {
        if (notificationId == null || notificationId <= 0) {
            throw new IllegalArgumentException("Notification ID must be a positive number.");
        }
    }
}
