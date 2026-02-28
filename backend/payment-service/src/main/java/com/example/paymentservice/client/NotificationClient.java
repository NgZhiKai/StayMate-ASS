package com.example.paymentservice.client;

import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class NotificationClient {
    private static final String NOTIFICATIONS_PATH = "/notifications";
    private static final String PAYMENT_TYPE = "PAYMENT";
    private static final String USER_ID_KEY = "userId";
    private static final String MESSAGE_KEY = "message";
    private static final String TYPE_KEY = "type";

    private final RestTemplate restTemplate;

    // Base URL of your Notification microservice
    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    public NotificationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendNotification(Long userId, String message) {
        String safeMessage = Objects.requireNonNull(message, "Notification message must not be null");
        Long safeUserId = Objects.requireNonNull(userId, "User ID must not be null");

        String url = UriComponentsBuilder.fromUriString(notificationServiceUrl)
                .path(NOTIFICATIONS_PATH)
                .toUriString();

        Map<String, Object> body = Map.of(
                USER_ID_KEY, safeUserId,
                MESSAGE_KEY, safeMessage,
                TYPE_KEY, PAYMENT_TYPE);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, buildJsonHeaders());
        restTemplate.postForEntity(url, request, Void.class);
    }

    private HttpHeaders buildJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
