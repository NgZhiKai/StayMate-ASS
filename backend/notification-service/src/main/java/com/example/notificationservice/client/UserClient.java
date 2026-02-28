package com.example.notificationservice.client;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class UserClient {
    private static final String USERS_PATH = "/users";

    private final RestTemplate restTemplate;
    private final String userServiceUrl;

    public UserClient(RestTemplate restTemplate, @Value("${user.service.url}") String userServiceUrl) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }

    public List<Long> getAllUserIds() {
        String url = buildUsersUrl();
        UsersResponse response = restTemplate.getForObject(url, UsersResponse.class);
        return extractUserIds(response);
    }

    private String buildUsersUrl() {
        return UriComponentsBuilder.fromUriString(userServiceUrl)
                .path(USERS_PATH)
                .toUriString();
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
