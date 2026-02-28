package com.example.bookingservice.client;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RoomClient {
    private final RestTemplate restTemplate;

    @Value("${room.service.url}") // e.g., http://localhost:8083
    private String roomServiceUrl;

    @Value("${room.service.book-path:/rooms/%d/%d/book?checkIn=%s&checkOut=%s}")
    private String roomBookPath;

    @Value("${room.service.room-by-id-path:/rooms/%d/%d}")
    private String roomByIdPath;

    @Value("${room.service.rooms-by-hotel-path:/rooms/hotel/%d}")
    private String roomsByHotelPath;

    public RoomClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Book a room via RoomService
     * Returns an empty map if booking fails
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> bookRoom(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        String url = ClientCallSupport.buildUrl(roomServiceUrl, roomBookPath, hotelId, roomId, checkIn, checkOut);
        return ClientCallSupport.exchangeForBody(
                restTemplate,
                url,
                HttpMethod.POST,
                HttpEntity.EMPTY,
                Map.class,
                Collections.emptyMap());
    }

    /**
     * Fetch room details by hotelId and roomId
     * Handles the "message" + "data" wrapper returned by RoomService
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getRoomById(Long hotelId, Long roomId) {
        String url = ClientCallSupport.buildUrl(roomServiceUrl, roomByIdPath, hotelId, roomId);
        return ClientCallSupport.exchangeForBody(
                restTemplate,
                url,
                HttpMethod.GET,
                HttpEntity.EMPTY,
                Map.class,
                Collections.emptyMap());
    }

    /**
     * Fetch all rooms for a hotel
     * Returns empty list if service fails
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getRoomsByHotelId(Long hotelId) {
        String url = ClientCallSupport.buildUrl(roomServiceUrl, roomsByHotelPath, hotelId);
        return ClientCallSupport.exchangeForBody(
                restTemplate,
                url,
                HttpMethod.GET,
                HttpEntity.EMPTY,
                List.class,
                Collections.emptyList());
    }
}
