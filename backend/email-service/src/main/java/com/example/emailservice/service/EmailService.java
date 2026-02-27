package com.example.emailservice.service;

import jakarta.mail.MessagingException;
import java.io.IOException;
import com.example.emailservice.exception.EmailServiceException;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail;

    @Autowired
    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    // Generic method to send any type of email
    public void sendEmail(String to, String subject, String messageText, String token, String link, String buttonText)
            throws EmailServiceException {
        try {
            // Load generic template
            var inputStream = Objects.requireNonNull(
                    EmailService.class.getResourceAsStream("/templates/email-template.html"));
            String body = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);

            // Replace placeholders
            body = body.replace("{{title}}", subject)
                    .replace("{{message}}", messageText)
                    .replace("{{token}}", token)
                    .replace("{{link}}", link)
                    .replace("{{buttonText}}", buttonText);

            sendSimpleEmail(to, subject, body);

        } catch (IOException | NullPointerException e) {
            throw new EmailServiceException("Error reading email template", e);
        }
    }

    // Old sendSimpleEmail remains unchanged
    public void sendSimpleEmail(String to, String subject, String body) throws EmailServiceException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailServiceException("Error sending email", e);
        }
    }

    // Convenience methods
    public void sendVerificationEmail(String to, String verificationLink, String token) throws EmailServiceException {
        sendEmail(
                to,
                "Email Verification",
                "Thank you for registering with Staymate! To complete your registration, verify your email using the token below:",
                token,
                verificationLink,
                "Verify Email");
    }

    public void sendPasswordResetEmail(String to, String resetLink, String token) throws EmailServiceException {
        sendEmail(
                to,
                "Reset Your Password",
                "We received a request to reset your password. Use the token below to continue:",
                token,
                resetLink,
                "Reset Password");
    }
}