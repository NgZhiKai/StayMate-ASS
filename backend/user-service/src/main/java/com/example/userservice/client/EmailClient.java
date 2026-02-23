package com.example.userservice.client;

import com.example.userservice.dto.EmailRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class EmailClient {

    private final RestTemplate restTemplate;
    private final String emailServiceUrl;

    public EmailClient(RestTemplate restTemplate,
            @Value("${email.service.url}") String emailServiceUrl) {
        this.restTemplate = restTemplate;
        this.emailServiceUrl = emailServiceUrl;
    }

    /**
     * Send email using EmailRequestDTO
     */
    public boolean sendEmail(EmailRequestDTO emailRequest) {
        String url = emailServiceUrl + "/email/send-email";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<EmailRequestDTO> request = new HttpEntity<>(emailRequest, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            System.err.println("Failed to send email request: " + e.getMessage());
            return false;
        }
    }
}