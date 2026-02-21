package com.example.bookingservice.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.bookingservice.client.NotificationClient;
import com.example.bookingservice.client.RoomClient;
import com.example.bookingservice.client.UserClient;
import com.example.bookingservice.dto.BookingRequestDTO;
import com.example.bookingservice.dto.BookingResponseDTO;
import com.example.bookingservice.dto.UserBookingResponseDTO;
import com.example.bookingservice.entity.Booking;
import com.example.bookingservice.entity.BookingStatus;
import com.example.bookingservice.repository.BookingRepository;

@Service
public class BookingService {

    private static final Logger logger = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final NotificationClient notificationClient;
    private final RoomClient roomClient;
    private final UserClient userClient;

    public BookingService(BookingRepository bookingRepository,
            NotificationClient notificationClient,
            RoomClient roomClient,
            UserClient userClient) {
        this.bookingRepository = bookingRepository;
        this.notificationClient = notificationClient;
        this.roomClient = roomClient;
        this.userClient = userClient;
    }

    // ------------------- Booking CRUD -------------------
    @Transactional
    public List<Booking> createBooking(BookingRequestDTO dto) {

        validateBookingRequest(dto);

        if (dto.getRoomIds() == null || dto.getRoomIds().isEmpty()) {
            throw new IllegalArgumentException("At least one room must be selected");
        }

        List<Booking> createdBookings = new ArrayList<>();

        for (Long roomId : dto.getRoomIds()) {

            if (!isRoomAvailable(dto.getHotelId(), roomId,
                    dto.getCheckInDate(), dto.getCheckOutDate())) {

                throw new IllegalStateException(
                        "Room " + roomId + " is not available");
            }

            Booking booking = new Booking();
            booking.setHotelId(dto.getHotelId());
            booking.setRoomId(roomId);
            booking.setUserId(dto.getUserId());
            booking.setCheckInDate(dto.getCheckInDate());
            booking.setCheckOutDate(dto.getCheckOutDate());
            booking.setTotalAmount(dto.getTotalAmount() / dto.getRoomIds().size());
            booking.setBookingDate(LocalDate.now());
            booking.setStatus(BookingStatus.PENDING);

            createdBookings.add(bookingRepository.save(booking));
        }

        sendNotification(dto.getUserId(), "Your booking is pending confirmation.");

        return createdBookings;
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBookingById(bookingId);
        if (booking == null)
            throw new IllegalArgumentException("Booking not found");

        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);

        String message = switch (status) {
            case CONFIRMED -> "Your booking has been confirmed!";
            case CANCELLED -> "Your booking has been canceled.";
            default -> "Your booking status has been updated.";
        };
        sendNotification(booking.getUserId(), message);
        return updated;
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        if (booking == null)
            return null;

        booking.setStatus(BookingStatus.CANCELLED);
        Booking canceled = bookingRepository.save(booking);
        sendNotification(booking.getUserId(), "Your booking has been canceled.");
        return canceled;
    }

    // ------------------- Read Operations -------------------

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<BookingResponseDTO> getBookingsByHotel(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId).stream()
                .map(this::mapToBookingResponseDTO)
                .toList();
    }

    public List<UserBookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToUserBookingResponseDTO)
                .toList();
    }

    // ------------------- Availability -------------------

    public boolean isRoomAvailable(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Invalid check-in/check-out dates");
        }
        return bookingRepository.findOverlappingBookings(hotelId, roomId, checkIn, checkOut).isEmpty();
    }

    public List<Map<String, Object>> getAvailableRoomsForHotel(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        List<Booking> overlappingBookings = bookingRepository.findByHotelId(hotelId).stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED
                        && b.getCheckInDate().isBefore(checkOut)
                        && b.getCheckOutDate().isAfter(checkIn))
                .toList();

        List<Long> bookedRoomIds = overlappingBookings.stream()
                .map(Booking::getRoomId)
                .toList();

        List<Map<String, Object>> allRooms = roomClient.getRoomsByHotelId(hotelId);

        return allRooms.stream()
                .filter(r -> !bookedRoomIds.contains(((Number) r.get("room_id")).longValue()))
                .toList();
    }

    // ------------------- Search / Query -------------------

    public List<Booking> getBookingsByDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || !endDate.isAfter(startDate)) {
            return Collections.emptyList();
        }
        return bookingRepository.findBookingsByDateRange(startDate, endDate);
    }

    // ------------------- Mapping Helpers -------------------

    private BookingResponseDTO mapToBookingResponseDTO(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(b.getId());
        dto.setHotelId(b.getHotelId());
        dto.setRoomId(b.getRoomId());
        dto.setCheckInDate(b.getCheckInDate());
        dto.setCheckOutDate(b.getCheckOutDate());
        dto.setStatus(b.getStatus() != null ? b.getStatus().toString() : null);
        dto.setTotalAmount(b.getTotalAmount());

        Map<String, Object> user = userClient.getUserById(b.getUserId());
        dto.setFirstName((String) user.getOrDefault("firstName", null));
        dto.setLastName((String) user.getOrDefault("lastName", null));
        dto.setEmail((String) user.getOrDefault("email", null));
        dto.setPhone((String) user.getOrDefault("phoneNumber", null));

        Map<String, Object> room = roomClient.getRoomById(b.getHotelId(), b.getRoomId());
        dto.setRoomType(room.getOrDefault("room_type", "").toString());

        return dto;
    }

    private UserBookingResponseDTO mapToUserBookingResponseDTO(Booking b) {
        UserBookingResponseDTO dto = new UserBookingResponseDTO();
        dto.setBookingId(b.getId());
        dto.setHotelId(b.getHotelId());
        dto.setRoomId(b.getRoomId());
        dto.setCheckInDate(b.getCheckInDate());
        dto.setCheckOutDate(b.getCheckOutDate());
        dto.setStatus(b.getStatus() != null ? b.getStatus().toString() : null);

        Map<String, Object> room = roomClient.getRoomById(b.getHotelId(), b.getRoomId());
        dto.setRoomType(room.getOrDefault("room_type", "").toString());

        return dto;
    }

    // ------------------- Helpers -------------------

    private void sendNotification(Long userId, String message) {
        try {
            notificationClient.sendNotification(userId, message);
        } catch (Exception e) {
            logger.warn("Failed to send notification: {}", e.getMessage());
        }
    }

    private void validateBookingRequest(BookingRequestDTO dto) {

        if (dto.getHotelId() == null)
            throw new IllegalArgumentException("Hotel ID is required");

        if (dto.getUserId() == null)
            throw new IllegalArgumentException("User ID is required");

        if (dto.getRoomIds() == null || dto.getRoomIds().isEmpty())
            throw new IllegalArgumentException("At least one room must be selected");

        if (dto.getRoomIds().stream().anyMatch(Objects::isNull))
            throw new IllegalArgumentException("Room ID list contains null values");

        if (dto.getCheckInDate() == null || dto.getCheckOutDate() == null)
            throw new IllegalArgumentException("Check-in and check-out dates are required");

        if (!dto.getCheckOutDate().isAfter(dto.getCheckInDate()))
            throw new IllegalArgumentException("Check-out date must be after check-in date");
    }
}