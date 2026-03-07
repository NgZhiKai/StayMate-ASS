package com.example.bookingservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bookingservice.dto.BookingRequestDTO;
import com.example.bookingservice.dto.BookingResponseDTO;
import com.example.bookingservice.dto.UserBookingResponseDTO;
import com.example.bookingservice.entity.Booking;
import com.example.bookingservice.entity.BookingStatus;
import com.example.bookingservice.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/bookings")
@Validated
public class BookingController {
    private static final String MESSAGE_KEY = "message";
    private static final String DATA_KEY = "data";
    private static final String BOOKINGS_KEY = "bookings";
    private static final String BOOKING_ID_KEY = "bookingId";
    private static final String STATUS_KEY = "status";
    private static final String AVAILABLE_KEY = "available";

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // ------------------- Booking CRUD -------------------
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@Valid @RequestBody BookingRequestDTO dto) {
        List<Booking> bookings = bookingService.createBooking(dto);
        return created("Booking(s) created successfully", BOOKINGS_KEY, bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ok(DATA_KEY, booking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        return okWithStatus("Booking cancelled successfully", booking.getId(), booking.getStatus());
    }

    @PostMapping("/{bookingId}/status")
    public ResponseEntity<Map<String, Object>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        Booking updated = bookingService.updateBookingStatus(bookingId, status);
        return okWithStatus("Booking status updated", updated.getId(), updated.getStatus());
    }

    // ------------------- Queries -------------------

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Map<String, Object>> getBookingsForHotel(@PathVariable Long hotelId) {
        List<BookingResponseDTO> bookings = bookingService.getBookingsByHotel(hotelId);
        return ok(DATA_KEY, bookings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getBookingsForUser(@PathVariable Long userId) {
        List<UserBookingResponseDTO> bookings = bookingService.getBookingsByUser(userId);
        return ok(DATA_KEY, bookings);
    }

    @GetMapping("/search/date")
    public ResponseEntity<Map<String, Object>> searchBookingsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Booking> bookings = bookingService.getBookingsByDateRange(startDate, endDate);
        return ok(DATA_KEY, bookings);
    }

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> checkRoomAvailability(
            @RequestParam Long hotelId,
            @RequestParam Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        boolean available = bookingService.isRoomAvailable(hotelId, roomId, checkIn, checkOut);
        return ok(AVAILABLE_KEY, available);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ok(DATA_KEY, bookings);
    }

    private ResponseEntity<Map<String, Object>> ok(String key, Object value) {
        return ResponseEntity.ok(Map.of(key, value));
    }

    private ResponseEntity<Map<String, Object>> created(String message, String dataKey, Object dataValue) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(MESSAGE_KEY, message, dataKey, dataValue));
    }

    private ResponseEntity<Map<String, Object>> okWithStatus(String message, Long bookingId, BookingStatus status) {
        return ResponseEntity.ok(Map.of(
                MESSAGE_KEY, message,
                BOOKING_ID_KEY, bookingId,
                STATUS_KEY, status));
    }

}
