package com.example.notificationservice.client;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class UserClient {
    private static final String DISCOVERY_BASE_PREFIX = "http://";
    private static final String USERS_PATH = "/users";

    private final RestTemplate restTemplate;
    private final String userServiceName;

    public UserClient(
            RestTemplate restTemplate,
            @Value("${user.service.name:user-service}") String userServiceName) {
        this.restTemplate = restTemplate;
        this.userServiceName = userServiceName;
    }

    public List<Long> getAllUserIds() {
        String url = buildUsersUrl();
        UsersResponse response = restTemplate.getForObject(url, UsersResponse.class);
        return extractUserIds(response);
    }

    private String buildUsersUrl() {
        String baseUrl = resolveBaseUrl();
        return UriComponentsBuilder.fromUriString(baseUrl)
                .path(USERS_PATH)
                .toUriString();
    }

    private String resolveBaseUrl() {
        return DISCOVERY_BASE_PREFIX + userServiceName;
    }

    private List<Long> extractUserIds(UsersResponse response) {
        if (response == null || response.getData() == null) {
            return List.of();
        }

        return response.getData().stream()
                .filter(Objects::nonNull)
                .map(UsersResponse.UserDTO::getId)
                .filter(Objects::nonNull)
                .toList();
    }
}
