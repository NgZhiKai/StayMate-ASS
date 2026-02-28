package com.example.hotelservice.client;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class BookingClient {
    private static final String AVAILABILITY_PATH = "/bookings/availability";
    private static final String HOTEL_ID_PARAM = "hotelId";
    private static final String ROOM_ID_PARAM = "roomId";
    private static final String CHECK_IN_PARAM = "checkIn";
    private static final String CHECK_OUT_PARAM = "checkOut";

    private final RestTemplate restTemplate;

    @Value("${booking.service.url}")
    private String bookingServiceUrl;

    public BookingClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public boolean isRoomAvailable(Long hotelId,
                                   Long roomId,
                                   LocalDate checkIn,
                                   LocalDate checkOut) {
        String url = buildAvailabilityUrl(hotelId, roomId, checkIn, checkOut);
        return fetchAvailability(url);
    }

    private String buildAvailabilityUrl(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        return UriComponentsBuilder.fromUriString(bookingServiceUrl)
                .path(AVAILABILITY_PATH)
                .queryParam(HOTEL_ID_PARAM, hotelId)
                .queryParam(ROOM_ID_PARAM, roomId)
                .queryParam(CHECK_IN_PARAM, checkIn)
                .queryParam(CHECK_OUT_PARAM, checkOut)
                .toUriString();
    }

    private boolean fetchAvailability(String url) {
        try {
            Boolean response = restTemplate.getForObject(url, Boolean.class);
            return Boolean.TRUE.equals(response);
        } catch (Exception e) {
            return false; // fail-safe
        }
    }
}
