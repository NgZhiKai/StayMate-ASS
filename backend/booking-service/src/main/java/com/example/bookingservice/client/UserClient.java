package com.example.bookingservice.client;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {
    private final RestTemplate restTemplate;

    @Value("${user.service.url}")
    private String userServiceUrl;

    @Value("${user.service.user-by-id-path:/users/%d}")
    private String userByIdPath;

    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch a user by ID from UserService.
     * Returns a Map containing user fields, or an empty map if not found.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getUserById(Long userId) {
        String url = ClientCallSupport.buildUrl(userServiceUrl, userByIdPath, userId);
        Map<String, Object> response = ClientCallSupport.exchangeForBody(
                restTemplate,
                url,
                HttpMethod.GET,
                HttpEntity.EMPTY,
                Map.class,
                Collections.emptyMap());
        if (response.containsKey("data")) {
            Object data = response.get("data");
            if (data instanceof Map<?, ?> dataMap) {
                return (Map<String, Object>) dataMap;
            }
        }
        return Collections.emptyMap();
    }
}
