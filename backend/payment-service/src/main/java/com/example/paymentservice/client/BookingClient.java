package com.example.paymentservice.client;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.paymentservice.dto.booking.BookingDTO;
import com.example.paymentservice.dto.booking.UserBookingDTO;
import com.example.paymentservice.exception.BookingClientException;

@Service
public class BookingClient {

    private final RestTemplate restTemplate;

    @Value("${booking.service.url}")
    private String bookingServiceUrl;

    public BookingClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Optional<BookingDTO> getBookingById(Long bookingId) {
        try {
            BookingDTO booking = restTemplate.getForObject(
                    bookingServiceUrl + "/bookings/" + bookingId,
                    BookingDTO.class);
            return Optional.ofNullable(booking);
        } catch (HttpClientErrorException.NotFound e) {
            return Optional.empty(); // Booking not found is fine
        } catch (Exception e) {
            throw new BookingClientException("Failed to fetch booking with ID: " + bookingId, e);
        }
    }

    public List<UserBookingDTO> getBookingsByUserId(Long userId) {
        try {
            UserBookingDTO[] bookings = restTemplate.getForObject(
                    bookingServiceUrl + "/bookings/user/" + userId,
                    UserBookingDTO[].class);
            return bookings != null ? List.of(bookings) : List.of();
        } catch (Exception e) {
            throw new BookingClientException("Failed to fetch bookings for user ID: " + userId, e);
        }
    }

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
            throw new BookingClientException("Failed to update booking status for booking ID: " + bookingId, e);
        }
    }
}