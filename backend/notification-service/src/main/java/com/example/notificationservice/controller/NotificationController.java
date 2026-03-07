package com.example.notificationservice.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.notificationservice.dto.NotificationRequestDTO;
import com.example.notificationservice.dto.PromotionRequestDTO;
import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.entity.NotificationType;
import com.example.notificationservice.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/notifications")
@Validated
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Create a new notification for a single user
    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @Valid @RequestBody NotificationRequestDTO request) {
        Notification saved = notificationService.createNotification(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
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

    @PutMapping("/user/{userId}/read")
    public ResponseEntity<Map<String, String>> markAllAsRead(@PathVariable Long userId) {
        int updatedCount = notificationService.markAllNotificationsAsRead(userId);
        Map<String, String> response = Map.of("message", "Marked " + updatedCount + " notifications as read");
        return ResponseEntity.ok(response);
    }

    // Send promotion notifications to all users from User Service
    @PostMapping("/promotion")
    public ResponseEntity<String> sendPromotionNotifications(@Valid @RequestBody PromotionRequestDTO request) {
        int count = notificationService.sendPromotionNotifications(request.getMessage());
        return ResponseEntity.ok("Promotion notifications sent successfully to " + count + " users.");
    }
}
