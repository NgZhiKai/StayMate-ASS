package com.example.hotelservice.client;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class BookingClient {

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
        try {
            String url = String.format(
                    "%s/bookings/availability?hotelId=%d&roomId=%d&checkIn=%s&checkOut=%s",
                    bookingServiceUrl,
                    hotelId,
                    roomId,
                    checkIn,
                    checkOut
            );

            Boolean response = restTemplate.getForObject(url, Boolean.class);
            return response != null && response;

        } catch (Exception e) {
            return false; // fail-safe
        }
    }
}