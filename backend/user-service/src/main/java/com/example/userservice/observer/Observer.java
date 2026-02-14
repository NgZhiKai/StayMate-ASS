package com.example.userservice.observer;

import java.util.Map;

public interface Observer {
    void update(Map<String, Object> data);
}