package com.example.emailservice.controller;

import com.example.emailservice.service.EmailService;
import com.example.emailservice.exception.EmailServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("email")
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Endpoint to send a verification email.
     * Expects JSON: { "to": "recipient@example.com", "token": "...", "verificationLink": "..." }
     */
    @PostMapping("/send-verification")
    public ResponseEntity<String> sendVerificationEmail(@RequestBody Map<String, String> payload) {
        String to = payload.get("to");
        String token = payload.get("token");
        String verificationLink = payload.get("verificationLink");
        if (to == null || token == null) {
            return ResponseEntity.badRequest().body("Missing required fields: to, token");
        }
        try {
            emailService.sendVerificationEmail(to, verificationLink, token);
            return ResponseEntity.ok("Verification email sent successfully.");
        } catch (EmailServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email: " + e.getMessage());
        }
    }
}
