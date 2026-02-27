package com.example.userservice.dto;

public class VerificationResult {
    private Long userId;
    private String tokenType; // "NEW_USER" or "EXISTING_USER"

    public VerificationResult(Long userId, String tokenType) {
        this.userId = userId;
        this.tokenType = tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTokenType() {
        return tokenType;
    }
}
