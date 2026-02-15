package com.example.bookingservice.client;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RoomClient {

    private final RestTemplate restTemplate;

    @Value("${room.service.url}") // e.g., http://localhost:8083
    private String roomServiceUrl;

    public RoomClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Book a room via RoomService
     * Returns an empty map if booking fails
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> bookRoom(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        try {
            String url = String.format("%s/rooms/%d/%d/book?checkIn=%s&checkOut=%s",
                    roomServiceUrl, hotelId, roomId, checkIn, checkOut);
            Map<String, Object> result = restTemplate.postForObject(url, null, Map.class);
            return result != null ? result : Collections.emptyMap();
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    /**
     * Fetch room details by hotelId and roomId
     * Handles the "message" + "data" wrapper returned by RoomService
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getRoomById(Long hotelId, Long roomId) {
        try {
            String url = String.format("%s/rooms/%d/%d", roomServiceUrl, hotelId, roomId);
            Map<String, Object> room = restTemplate.getForObject(url, Map.class);

            if (room != null) {
                return room; // room object is returned directly
            } else {
                return Collections.emptyMap();
            }
        } catch (Exception e) {
            // fallback if service call fails
            return Collections.emptyMap();
        }
    }

    public boolean markRoomAvailable(Long hotelId, Long roomId) {
        try {
            String url = String.format("%s/rooms/%d/%d/available", roomServiceUrl, hotelId, roomId);
            // Assuming RoomService exposes a PUT endpoint to mark a room as available
            restTemplate.put(url, null);
            return true;
        } catch (Exception e) {
            // log error
            return false;
        }
    }
}