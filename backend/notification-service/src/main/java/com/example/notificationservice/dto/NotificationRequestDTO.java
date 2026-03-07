package com.example.notificationservice.dto;

import com.example.notificationservice.entity.NotificationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class NotificationRequestDTO {
    @NotNull(message = "User ID is required.")
    @Positive(message = "User ID must be a positive number.")
    private Long userId;

    @NotBlank(message = "Notification message is required.")
    private String message;

    @NotNull(message = "Notification type is required.")
    private NotificationType type;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    // getters and setters

}
