package com.example.notificationservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.notificationservice.client.UserClient;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.entity.NotificationType;
import com.example.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserClient userClient;

    public NotificationController(NotificationService notificationService, UserClient userClient) {
        this.notificationService = notificationService;
        this.userClient = userClient;
    }

    // Create a new notification for a single user
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestParam Long userId,
            @RequestParam String message,
            @RequestParam NotificationType type) {

        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);

        Notification saved = notificationService.createNotification(notification);
        return ResponseEntity.ok(saved);
    }

    // Get all notifications for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserId(userId));
    }

    // Get notifications by read status
    @GetMapping("/user/{userId}/read")
    public ResponseEntity<List<Notification>> getReadNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserIdAndReadStatus(userId, true));
    }

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserIdAndReadStatus(userId, false));
    }

    // Get notifications by type
    @GetMapping("/user/{userId}/type/{type}")
    public ResponseEntity<List<Notification>> getNotificationsByType(
            @PathVariable Long userId,
            @PathVariable NotificationType type) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserIdAndType(userId, type));
    }

    // Mark a notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Notification> markNotificationAsRead(@PathVariable Long notificationId) {
        Notification updated = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(updated);
    }

    // Send promotion notifications to all users from User Service
    @PostMapping("/promotion")
    public ResponseEntity<String> sendPromotionNotifications(@RequestBody PromotionMessage request) {
        // Fetch all user IDs from User Service
        List<Long> userIds = userClient.getAllUserIds();

        // Send notification to each user
        userIds.forEach(userId -> {
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setMessage(request.getMessage());
            notification.setType(NotificationType.PROMOTION);
            notificationService.createNotification(notification);
        });

        return ResponseEntity.ok("Promotion notifications sent successfully to " + userIds.size() + " users.");
    }

    // DTO for promotion message
    public static class PromotionMessage {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}