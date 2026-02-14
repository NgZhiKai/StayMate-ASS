package com.example.notificationservice.client;

import java.util.List;

public class UsersResponse {
    private String message;
    private List<UserDTO> data; // matches the JSON key "data"

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<UserDTO> getData() { return data; }
    public void setData(List<UserDTO> data) { this.data = data; }

    public static class UserDTO {
        private Long id;
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
    }
}