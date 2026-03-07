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
    private static final String DISCOVERY_BASE_PREFIX = "http://";

    private final RestTemplate restTemplate;
    private final String userServiceName;
    private final String userByIdPath;

    public UserClient(
            RestTemplate restTemplate,
            @Value("${user.service.name:user-service}") String userServiceName,
            @Value("${user.service.user-by-id-path:/users/%d}") String userByIdPath) {
        this.restTemplate = restTemplate;
        this.userServiceName = userServiceName;
        this.userByIdPath = userByIdPath;
    }

    /**
     * Fetch a user by ID from UserService.
     * Returns a Map containing user fields, or an empty map if not found.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getUserById(Long userId) {
        String url = ClientCallSupport.buildUrl(resolveBaseUrl(), userByIdPath, userId);
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

    private String resolveBaseUrl() {
        return DISCOVERY_BASE_PREFIX + userServiceName;
    }
}
