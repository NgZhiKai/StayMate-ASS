package com.example.notificationservice.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class UserClient {

    private final RestTemplate restTemplate;
    private final String userServiceUrl;

    public UserClient(RestTemplate restTemplate, @Value("${user.service.url}") String userServiceUrl) {
        this.restTemplate = restTemplate;
        this.userServiceUrl = userServiceUrl;
    }

    public List<Long> getAllUserIds() {
        String url = UriComponentsBuilder.fromHttpUrl(userServiceUrl)
                .path("/users")
                .toUriString();

        UsersResponse response = restTemplate.getForObject(url, UsersResponse.class);

        if (response == null || response.getData() == null) {
            return List.of(); // return empty list instead of null to avoid NPE
        }

        return response.getData().stream()
                .map(UsersResponse.UserDTO::getId)
                .toList();
    }
}