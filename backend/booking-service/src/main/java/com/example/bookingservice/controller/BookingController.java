package com.example.bookingservice.controller;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.bookingservice.dto.BookingRequestDTO;
import com.example.bookingservice.dto.BookingResponseDTO;
import com.example.bookingservice.dto.UserBookingResponseDTO;
import com.example.bookingservice.entity.Booking;
import com.example.bookingservice.service.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /** Create a new booking */
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO dto) {
        try {
            Booking booking = bookingService.createBooking(dto);
            Map<String, Object> response = Map.of(
                    "message", "Booking created successfully",
                    "bookingId", booking.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create booking"));
        }
    }

    /** Get booking by ID */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Booking dto = bookingService.getBookingById(id);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Booking not found");
        }

        return ResponseEntity.ok(dto);
    }

    /** Cancel a booking */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
        }
        Map<String, Object> response = Map.of(
                "message", "Booking cancelled successfully",
                "bookingId", booking.getId(),
                "status", booking.getStatus());
        return ResponseEntity.ok(response);
    }

    /** Get all bookings for a hotel */
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsForHotel(@PathVariable Long hotelId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByHotel(hotelId);
        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(bookings);
    }

    /** Get all bookings for a user */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBookingResponseDTO>> getBookingsForUser(@PathVariable Long userId) {
        List<UserBookingResponseDTO> bookings = bookingService.getBookingsByUser(userId);
        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(bookings);
    }

    /** Get all bookings */
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        if (bookings.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }
        return ResponseEntity.ok(bookings);
    }

    /** Check room availability */
    @GetMapping("/availability")
    public ResponseEntity<Boolean> checkRoomAvailability(
            @RequestParam Long hotelId,
            @RequestParam Long roomId,
            @RequestParam LocalDate checkIn,
            @RequestParam LocalDate checkOut) {

        if (checkOut.isBefore(checkIn)) {
            return ResponseEntity.badRequest().body(false);
        }

        boolean available = bookingService.isRoomAvailable(hotelId, roomId, checkIn, checkOut);
        return ResponseEntity.ok(available);
    }
}