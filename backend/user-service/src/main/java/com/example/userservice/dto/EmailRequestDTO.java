package com.example.userservice.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for sending emails (verification or password reset)
 */
public class EmailRequestDTO {

    @NotBlank(message = "Recipient email is required")
    private String to;

    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "Type is required: 'verification' or 'reset'")
    private String type; // either "verification" or "reset"

    private String link; // optional link for verification/reset

    public EmailRequestDTO() {
    }

    public EmailRequestDTO(String to, String token, String type, String link) {
        this.to = to;
        this.token = token;
        this.type = type;
        this.link = link;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
}