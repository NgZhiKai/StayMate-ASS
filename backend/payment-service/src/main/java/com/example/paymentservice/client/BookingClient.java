package com.example.paymentservice.client;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.paymentservice.dto.booking.BookingDTO;
import com.example.paymentservice.dto.booking.UserBookingDTO;
import com.example.paymentservice.exception.BookingClientException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class BookingClient {

    private final RestTemplate restTemplate;

    @Value("${booking.service.url}")
    private String bookingServiceUrl;

    private final ObjectMapper mapper;

    public BookingClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule()); // Support for LocalDate / LocalDateTime
    }

    /**
     * Fetch a booking by ID
     */
    public Optional<BookingDTO> getBookingById(Long bookingId) {
        try {
            String responseStr = restTemplate.getForObject(
                    bookingServiceUrl + "/bookings/" + bookingId,
                    String.class);

            JsonNode dataNode = mapper.readTree(responseStr).path("data");
            if (dataNode.isMissingNode() || dataNode.isNull()) {
                return Optional.empty();
            }

            BookingDTO booking = mapper.treeToValue(dataNode, BookingDTO.class);
            return Optional.of(booking);

        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty();
        } catch (Exception e) {
            throw new BookingClientException(
                    "Failed to fetch booking with ID: " + bookingId + ". Response: " + e.getMessage(), e);
        }
    }

    /**
     * Fetch bookings for a user
     */
    public List<UserBookingDTO> getBookingsByUserId(Long userId) {
        try {
            // Call the booking service
            String responseStr = restTemplate.getForObject(
                    bookingServiceUrl + "/bookings/user/" + userId,
                    String.class);

            // Map the "data" array directly into List<UserBookingDTO>
            return mapper.readValue(
                    mapper.readTree(responseStr).path("data").toString(),
                    new TypeReference<List<UserBookingDTO>>() {
                    });

        } catch (HttpClientErrorException.NotFound e) {
            return Collections.emptyList();
        } catch (Exception e) {
            throw new BookingClientException(
                    "Failed to fetch bookings for user ID: " + userId + ". " + e.getMessage(), e);
        }
    }

    /**
     * Update booking status
     */
    public void updateBookingStatus(Long bookingId, String status) {
        try {
            restTemplate.postForEntity(
                    bookingServiceUrl + "/bookings/" + bookingId + "/status?status=" + status,
                    null,
                    Void.class);
        } catch (HttpClientErrorException e) {
            throw new BookingClientException(
                    "Failed to update booking status for booking ID: " + bookingId + " (HTTP " + e.getStatusCode()
                            + ")",
                    e);
        } catch (Exception e) {
            throw new BookingClientException(
                    "Failed to update booking status for booking ID: " + bookingId + ". " + e.getMessage(),
                    e);
        }
    }
}