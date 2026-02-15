package com.example.bookingservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@Component
public class NotificationClient {

    private final RestTemplate restTemplate;

    // Base URL of your Notification microservice
    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    public NotificationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendNotification(Long userId, String message) {
        String url = notificationServiceUrl + "/notifications";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "userId", userId,
                "message", message,
                "type", "BOOKING");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        // Make POST request
        restTemplate.postForEntity(url, request, Void.class);
    }
}