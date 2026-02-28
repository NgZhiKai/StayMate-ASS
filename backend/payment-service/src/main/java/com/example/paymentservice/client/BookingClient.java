package com.example.paymentservice.client;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.paymentservice.dto.booking.BookingDTO;
import com.example.paymentservice.dto.booking.UserBookingDTO;
import com.example.paymentservice.exception.BookingClientException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
public class BookingClient {
    private static final String BOOKING_BY_ID_PATH = "/bookings/%d";
    private static final String BOOKINGS_BY_USER_PATH = "/bookings/user/%d";
    private static final String BOOKING_STATUS_PATH = "/bookings/%d/status";
    private static final String STATUS_PARAM = "status";
    private static final String DATA_KEY = "data";

    private static final TypeReference<List<UserBookingDTO>> USER_BOOKING_LIST_TYPE = new TypeReference<>() {
    };

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
            String url = buildUrl(BOOKING_BY_ID_PATH, bookingId);
            String responseStr = restTemplate.getForObject(url, String.class);

            JsonNode dataNode = extractDataNode(responseStr);
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
            String url = buildUrl(BOOKINGS_BY_USER_PATH, userId);
            String responseStr = restTemplate.getForObject(url, String.class);
            JsonNode dataNode = extractDataNode(responseStr);
            if (dataNode.isMissingNode() || dataNode.isNull()) {
                return Collections.emptyList();
            }
            return mapper.readValue(dataNode.toString(), USER_BOOKING_LIST_TYPE);

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
            String url = UriComponentsBuilder.fromUriString(bookingServiceUrl)
                    .path(String.format(BOOKING_STATUS_PATH, bookingId))
                    .queryParam(STATUS_PARAM, status)
                    .toUriString();
            restTemplate.postForEntity(url, null, Void.class);
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

    private String buildUrl(String pathTemplate, Object... args) {
        String resolvedPath = String.format(pathTemplate, args);
        return UriComponentsBuilder.fromUriString(bookingServiceUrl)
                .path(resolvedPath)
                .toUriString();
    }

    private JsonNode extractDataNode(String responseStr) throws Exception {
        return mapper.readTree(responseStr).path(DATA_KEY);
    }
}
