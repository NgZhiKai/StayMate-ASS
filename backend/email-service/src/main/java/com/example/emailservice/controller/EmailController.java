package com.example.emailservice.controller;

import com.example.emailservice.dto.EmailRequestDTO;
import com.example.emailservice.exception.EmailServiceException;
import com.example.emailservice.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("email")
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Send an email for verification or password reset.
     * Expects JSON:
     * {
     * "to": "recipient@example.com",
     * "token": "...",
     * "type": "verification" or "reset",
     * "link": "..." // verificationLink or resetLink
     * }
     */
    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequestDTO request) {
        if (request.getTo() == null || request.getToken() == null || request.getType() == null) {
            return ResponseEntity.badRequest().body("Missing required fields: to, token, type");
        }

        try {
            switch (request.getType().toLowerCase()) {
                case "verification":
                    emailService.sendVerificationEmail(request.getTo(), request.getLink(), request.getToken());
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body("Verification email sent successfully.");
                case "reset":
                    emailService.sendPasswordResetEmail(request.getTo(), request.getLink(), request.getToken());
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body("Password reset email sent successfully.");
                default:
                    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                            .body("Invalid email type. Must be 'verification' or 'reset'.");
            }
        } catch (EmailServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}
