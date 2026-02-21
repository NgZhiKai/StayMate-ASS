package com.example.bookingservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.bookingservice.dto.BookingRequestDTO;
import com.example.bookingservice.dto.BookingResponseDTO;
import com.example.bookingservice.dto.UserBookingResponseDTO;
import com.example.bookingservice.entity.Booking;
import com.example.bookingservice.entity.BookingStatus;
import com.example.bookingservice.service.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ------------------- Booking CRUD -------------------
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO dto) {
        try {
            List<Booking> bookings = bookingService.createBooking(dto);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Booking(s) created successfully",
                            "bookings", bookings
                    ));

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create booking"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Booking not found"));
        }
        return ResponseEntity.ok(Map.of("data", booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Booking not found"));
        }
        return ResponseEntity.ok(Map.of(
                "message", "Booking cancelled successfully",
                "bookingId", booking.getId(),
                "status", booking.getStatus()));
    }

    @PostMapping("/{bookingId}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        Booking updated = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(Map.of(
                "message", "Booking status updated",
                "bookingId", updated.getId(),
                "status", updated.getStatus()));
    }

    // ------------------- Queries -------------------

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<?> getBookingsForHotel(@PathVariable Long hotelId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByHotel(hotelId);
        return ResponseEntity.ok(Map.of("data", bookings));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingsForUser(@PathVariable Long userId) {
        List<UserBookingResponseDTO> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(Map.of("data", bookings));
    }

    @GetMapping("/search/date")
    public ResponseEntity<?> searchBookingsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (!endDate.isAfter(startDate)) {
            return ResponseEntity.badRequest().body(Map.of("error", "End date must be after start date"));
        }

        List<Booking> bookings = bookingService.getBookingsByDateRange(startDate, endDate);
        return ResponseEntity.ok(Map.of("data", bookings));
    }

    @GetMapping("/availability")
    public ResponseEntity<?> checkRoomAvailability(
            @RequestParam Long hotelId,
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {

        if (!checkOut.isAfter(checkIn)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Check-out must be after check-in"));
        }

        boolean available = bookingService.isRoomAvailable(hotelId, roomId, checkIn, checkOut);
        return ResponseEntity.ok(Map.of("available", available));
    }
}