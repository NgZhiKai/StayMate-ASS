package com.example.emailservice.controller;

import com.example.emailservice.dto.EmailRequestDTO;
import com.example.emailservice.exception.EmailServiceException;
import com.example.emailservice.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("email")
@Validated
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Send an email for verification or password reset.
     * Expects JSON:
     * {
     * "to": "recipient@example.com",
     * "token": "...",
     * "type": "verification_new", "verification_existing", or "reset",
     * "link": "..." // verificationLink or resetLink
     * }
     */
    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailRequestDTO request) {
        try {
            String resultMessage = emailService.sendEmailByType(request);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(resultMessage);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(ex.getMessage());
        } catch (EmailServiceException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email: " + e.getMessage());
        }
    }
}
