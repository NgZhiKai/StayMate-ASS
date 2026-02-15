package com.example.bookingservice.client;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {

    private final RestTemplate restTemplate;

    @Value("${user.service.url}")
    private String userServiceUrl;

    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch a user by ID from UserService.
     * Returns a Map containing user fields, or an empty map if not found.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getUserById(Long userId) {
        try {
            String url = userServiceUrl + "/users/" + userId;
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("data")) {
                return (Map<String, Object>) response.get("data");
            }
            return Collections.emptyMap();
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}