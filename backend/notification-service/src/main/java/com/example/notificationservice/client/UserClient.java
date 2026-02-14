package com.example.notificationservice.client;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UserClient {

    private final RestTemplate restTemplate;
    private static final String USER_SERVICE_URL = "http://localhost:8081/users"; // replace with your UserService URL

    public UserClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<Long> getAllUserIds() {
        UsersResponse response = restTemplate.getForObject(USER_SERVICE_URL, UsersResponse.class);
        return response.getData().stream()
                       .map(UsersResponse.UserDTO::getId)
                       .collect(Collectors.toList());
    }
}