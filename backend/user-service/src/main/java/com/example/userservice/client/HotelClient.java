package com.example.userservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class HotelClient {

    private final RestTemplate restTemplate;
    private final String hotelServiceUrl;

    public HotelClient(RestTemplate restTemplate, @Value("${hotel.service.url}") String hotelServiceUrl) {
        this.restTemplate = restTemplate;
        this.hotelServiceUrl = hotelServiceUrl;
    }

    /**
     * Fetch hotel info by ID from the Hotel Service.
     */
    public HotelResponse getHotelById(Long hotelId) {
        String url = hotelServiceUrl + "/hotels/" + hotelId;
        try {
            return restTemplate.getForObject(url, HotelResponse.class);
        } catch (Exception e) {
            // Log error if needed
            return null;
        }
    }

    /**
     * Minimal DTO for hotel info.
     */
    public static class HotelResponse {
        private Long id;
        private String name;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}