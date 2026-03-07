package com.example.userservice.client;

import com.example.userservice.dto.EmailRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class EmailClient {

    private static final String DISCOVERY_BASE_PREFIX = "http://";
    private static final String SEND_EMAIL_PATH = "/email/send-email";

    private final RestTemplate restTemplate;
    private final String emailServiceName;

    public EmailClient(RestTemplate restTemplate,
            @Value("${email.service.name:email-service}") String emailServiceName) {
        this.restTemplate = restTemplate;
        this.emailServiceName = emailServiceName;
    }

    /**
     * Send email using EmailRequestDTO
     */
    public boolean sendEmail(EmailRequestDTO emailRequest) {
        String url = UriComponentsBuilder.fromUriString(resolveBaseUrl())
                .path(SEND_EMAIL_PATH)
                .toUriString();

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

    private String resolveBaseUrl() {
        return DISCOVERY_BASE_PREFIX + emailServiceName;
    }
}
