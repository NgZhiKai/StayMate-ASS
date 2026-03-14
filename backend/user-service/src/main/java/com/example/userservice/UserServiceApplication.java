package com.example.userservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserServiceApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceApplication.class);

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @jakarta.annotation.PostConstruct
    public void logDatasourceUrl() {
        LOGGER.info("UserService datasource URL (spring.datasource.url) = {}", datasourceUrl);
    }
}
