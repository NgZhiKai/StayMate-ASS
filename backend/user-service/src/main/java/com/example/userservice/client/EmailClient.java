package com.example.userservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Component
public class EmailClient {

    private final RestTemplate restTemplate;
    private final String emailServiceUrl;

    public EmailClient(RestTemplate restTemplate, @Value("${email.service.url}") String emailServiceUrl) {
        this.restTemplate = restTemplate;
        this.emailServiceUrl = emailServiceUrl;
    }

    public boolean sendVerificationEmail(String to, String token, String verificationLink) {
        String url = emailServiceUrl + "/email/send-verification";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> payload = new HashMap<>();
        payload.put("to", to);
        payload.put("token", token);
        payload.put("verificationLink", verificationLink);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);
        try {
            restTemplate.postForEntity(url, request, String.class);
            return true;
        } catch (Exception e) {
            // Log error as needed
            return false;
        }
    }
}
