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

    // Send email with verification link
    public void sendVerificationEmail(String to, String verificationLink, String token) throws EmailServiceException {
        String subject = "Email Verification";
        String body = getEmailContentWithVerificationLink(verificationLink, token);
        sendSimpleEmail(to, subject, body);
    }

    private String getEmailContentWithVerificationLink(String verificationLink, String token)
            throws EmailServiceException {
        try {
            var inputStream = Objects
                    .requireNonNull(EmailService.class.getResourceAsStream("/templates/email-content.html"));
            String emailContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            emailContent = emailContent.replace("{{verificationLink}}", verificationLink);
            emailContent = emailContent.replace("{{token}}", token);
            return emailContent;
        } catch (IOException e) {
            throw new EmailServiceException("Error reading email template", e);
        } catch (NullPointerException e) {
            throw new EmailServiceException("Email template not found", e);
        }
    }

    // Send email with dynamic body content
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
}