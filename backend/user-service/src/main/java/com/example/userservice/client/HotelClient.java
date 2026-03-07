package com.example.userservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class HotelClient {

    private static final String DISCOVERY_BASE_PREFIX = "http://";
    private static final String HOTELS_PATH = "/hotels/";

    private final RestTemplate restTemplate;
    private final String hotelServiceName;

    public HotelClient(
            RestTemplate restTemplate,
            @Value("${hotel.service.name:hotel-service}") String hotelServiceName) {
        this.restTemplate = restTemplate;
        this.hotelServiceName = hotelServiceName;
    }

    /**
     * Fetch hotel info by ID from the Hotel Service.
     */
    public HotelResponse getHotelById(Long hotelId) {
        String url = UriComponentsBuilder.fromUriString(resolveBaseUrl())
                .path(HOTELS_PATH + hotelId)
                .toUriString();
        try {
            return restTemplate.getForObject(url, HotelResponse.class);
        } catch (Exception e) {
            // Log error if needed
            return null;
        }
    }

    private String resolveBaseUrl() {
        return DISCOVERY_BASE_PREFIX + hotelServiceName;
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
