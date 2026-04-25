package com.example.emailservice.service;

import jakarta.mail.MessagingException;
import java.io.IOException;
import com.example.emailservice.exception.EmailServiceException;
import com.example.emailservice.dto.EmailRequestDTO;

import java.nio.charset.StandardCharsets;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final String TEMPLATE_DEFAULT = "/templates/email-template.html";
    private static final String TEMPLATE_NEW_USER = "/templates/email-template-new-user.html";
    private static final String TEMPLATE_EXISTING_USER = "/templates/email-template-existing-user.html";

    private final JavaMailSender mailSender;
    private final String fromEmail;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username}") String fromEmail) {
        this.mailSender = mailSender;
        this.fromEmail = fromEmail;
    }

    public String sendEmailByType(EmailRequestDTO request) throws EmailServiceException {
        String normalizedType = requireNonBlank(request.getType(), "Type is required").toLowerCase();
        String to = requireNonBlank(request.getTo(), "Recipient email is required");
        String token = requireNonBlank(request.getToken(), "Token is required");
        String link = requireNonBlank(request.getLink(), "Email link is required");

        return switch (normalizedType) {
            case "verification_new" -> {
                sendVerificationEmailNewUser(to, link, token);
                yield "Verification email sent successfully.";
            }
            case "verification_existing" -> {
                sendVerificationEmailExistingUser(to, link, token);
                yield "Verification email sent successfully.";
            }
            case "reset" -> {
                sendPasswordResetEmail(to, link, token);
                yield "Password reset email sent successfully.";
            }
            default -> throw new IllegalArgumentException(
                    "Invalid email type. Must be 'verification_new', 'verification_existing', or 'reset'.");
        };
    }

    // Generic method to send any type of email
    public void sendEmail(String to, String subject, String messageText, String token, String link, String buttonText,
            String templatePath)
            throws EmailServiceException {
        try {
            String body = renderTemplate(templatePath, subject, messageText, token, link, buttonText);

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

            String safeFrom = requireText(fromEmail, "Sender email is required");
            String safeTo = requireText(to, "Recipient email is required");
            String safeSubject = requireText(subject, "Email subject is required");
            String safeBody = requireText(body, "Email body is required");

            helper.setFrom(safeFrom);
            helper.setTo(safeTo);
            helper.setSubject(safeSubject);
            helper.setText(safeBody, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailServiceException("Error sending email", e);
        }
    }

    // Convenience methods
    public void sendVerificationEmailNewUser(String to, String verificationLink, String token)
            throws EmailServiceException {
        sendEmail(
                to,
                "Email Verification",
                "Thank you for registering with Staymate! To complete your registration, verify your email using the token below:",
                token,
                verificationLink,
                "Verify Email",
                TEMPLATE_NEW_USER);
    }

    public void sendVerificationEmailExistingUser(String to, String verificationLink, String token)
            throws EmailServiceException {
        sendEmail(
                to,
                "Verify Your Email",
                "You already have a Staymate account. Please verify your email again using the token below:",
                token,
                verificationLink,
                "Verify Email",
                TEMPLATE_EXISTING_USER);
    }

    public void sendPasswordResetEmail(String to, String resetLink, String token) throws EmailServiceException {
        sendEmail(
                to,
                "Reset Your Password",
                "We received a request to reset your password. Use the token below to continue:",
                token,
                resetLink,
                "Reset Password",
                TEMPLATE_DEFAULT);
    }

    private @NonNull String requireText(@Nullable String value, String message) {
        return Objects.requireNonNull(value, message);
    }

    private String renderTemplate(String templatePath, String subject, String messageText, String token, String link,
            String buttonText)
            throws IOException {
        String body = loadTemplate(templatePath);
        return body.replace("{{title}}", subject)
                .replace("{{message}}", messageText)
                .replace("{{token}}", token)
                .replace("{{link}}", link)
                .replace("{{buttonText}}", buttonText);
    }

    private String loadTemplate(String templatePath) throws IOException {
        var inputStream = Objects.requireNonNull(
                EmailService.class.getResourceAsStream(templatePath));
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    private String requireNonBlank(@Nullable String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalArgumentException(message);
        }
        return value.trim();
    }
}
