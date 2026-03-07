package com.example.notificationservice.dto;

import jakarta.validation.constraints.NotBlank;

public class PromotionRequestDTO {
    @NotBlank(message = "Promotion message is required.")
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
