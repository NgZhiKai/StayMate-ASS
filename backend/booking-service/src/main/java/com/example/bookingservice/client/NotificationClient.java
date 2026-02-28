package com.example.bookingservice.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationClient {
    private static final String BOOKING_NOTIFICATION_TYPE = "BOOKING";

    private final RestTemplate restTemplate;

    // Base URL of your Notification microservice
    @Value("${notification.service.url}")
    private String notificationServiceUrl;

    @Value("${notification.service.notifications-path:/notifications}")
    private String notificationsPath;

    public NotificationClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendNotification(Long userId, String message) {
        String url = ClientCallSupport.buildUrl(notificationServiceUrl, notificationsPath);
        Map<String, Object> body = Map.of(
                "userId", userId,
                "message", message,
                "type", BOOKING_NOTIFICATION_TYPE);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, buildJsonHeaders());
        restTemplate.exchange(url, HttpMethod.POST, request, Void.class);
    }

    private HttpHeaders buildJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
