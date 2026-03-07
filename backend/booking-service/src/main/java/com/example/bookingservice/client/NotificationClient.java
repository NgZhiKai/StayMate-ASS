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
    private static final String DISCOVERY_BASE_PREFIX = "http://";
    private static final String BOOKING_NOTIFICATION_TYPE = "BOOKING";

    private final RestTemplate restTemplate;
    private final String notificationServiceName;
    private final String notificationsPath;

    public NotificationClient(
            RestTemplate restTemplate,
            @Value("${notification.service.name:notification-service}") String notificationServiceName,
            @Value("${notification.service.notifications-path:/notifications}") String notificationsPath) {
        this.restTemplate = restTemplate;
        this.notificationServiceName = notificationServiceName;
        this.notificationsPath = notificationsPath;
    }

    public void sendNotification(Long userId, String message) {
        String url = ClientCallSupport.buildUrl(resolveBaseUrl(), notificationsPath);
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

    private String resolveBaseUrl() {
        return DISCOVERY_BASE_PREFIX + notificationServiceName;
    }
}
