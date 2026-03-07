package com.example.hotelservice.client;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class BookingClient {
    private static final String DISCOVERY_BASE_PREFIX = "http://";
    private static final String AVAILABILITY_PATH = "/bookings/availability";
    private static final String HOTEL_ID_PARAM = "hotelId";
    private static final String ROOM_ID_PARAM = "roomId";
    private static final String CHECK_IN_PARAM = "checkIn";
    private static final String CHECK_OUT_PARAM = "checkOut";

    private final RestTemplate restTemplate;
    private final String bookingServiceName;

    public BookingClient(
            RestTemplate restTemplate,
            @Value("${booking.service.name:booking-service}") String bookingServiceName) {
        this.restTemplate = restTemplate;
        this.bookingServiceName = bookingServiceName;
    }

    public boolean isRoomAvailable(Long hotelId,
                                   Long roomId,
                                   LocalDate checkIn,
                                   LocalDate checkOut) {
        String url = buildAvailabilityUrl(hotelId, roomId, checkIn, checkOut);
        return fetchAvailability(url);
    }

    private String buildAvailabilityUrl(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        return UriComponentsBuilder.fromUriString(resolveBaseUrl())
                .path(AVAILABILITY_PATH)
                .queryParam(HOTEL_ID_PARAM, hotelId)
                .queryParam(ROOM_ID_PARAM, roomId)
                .queryParam(CHECK_IN_PARAM, checkIn)
                .queryParam(CHECK_OUT_PARAM, checkOut)
                .toUriString();
    }

    private String resolveBaseUrl() {
        return DISCOVERY_BASE_PREFIX + bookingServiceName;
    }

    private boolean fetchAvailability(String url) {
        try {
            Boolean response = restTemplate.getForObject(url, Boolean.class);
            return Boolean.TRUE.equals(response);
        } catch (Exception e) {
            return false;
        }
    }
}
