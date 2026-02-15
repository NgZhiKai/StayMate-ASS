package com.example.bookingservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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

    // ------------------- Booking Operations -------------------

    @Transactional
    public Booking createBooking(BookingRequestDTO dto) {
        // Validate input
        if (dto.getHotelId() == null) {
            throw new IllegalArgumentException("Hotel ID is required");
        }
        if (dto.getRoomId() == null) {
            throw new IllegalArgumentException("Room ID is required");
        }
        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (dto.getCheckInDate() == null || dto.getCheckOutDate() == null) {
            throw new IllegalArgumentException("Check-in and check-out dates are required");
        }
        if (dto.getCheckOutDate().isBefore(dto.getCheckInDate())) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        // Check room availability
        boolean available = isRoomAvailable(dto.getHotelId(), dto.getRoomId(),
                dto.getCheckInDate(), dto.getCheckOutDate());

        if (!available) {
            throw new IllegalStateException(
                    "Room " + dto.getRoomId() + " in hotel " + dto.getHotelId()
                            + " is not available for selected dates");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setHotelId(dto.getHotelId());
        booking.setRoomId(dto.getRoomId());
        booking.setUserId(dto.getUserId());
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setTotalAmount(Objects.requireNonNullElse(dto.getTotalAmount(), 0.0));
        booking.setBookingDate(LocalDate.now());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        // Send notification (optional)
        try {
            notificationClient.sendNotification(dto.getUserId(),
                    "Your booking is pending confirmation.");
        } catch (Exception e) {
            // Log failure but do not fail the booking
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return savedBooking;
    }

    @Transactional
    public Booking updateBooking(Booking booking) {
        Booking updatedBooking = bookingRepository.save(booking);

        String message = switch (booking.getStatus()) {
            case CONFIRMED -> "Your booking has been confirmed!";
            case CANCELLED -> "Your booking has been canceled.";
            default -> "Your booking status has been updated.";
        };

        sendNotification(booking.getUserId(), message);

        return updatedBooking;
    }

    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        if (booking == null) {
            logger.warn("Booking with ID {} not found", id);
            return null;
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking canceledBooking = bookingRepository.save(booking);
        logger.info("Booking {} cancelled", id);

        // Mark room as available via RoomClient
        try {
            boolean success = roomClient.markRoomAvailable(booking.getHotelId(), booking.getRoomId());
            if (success) {
                logger.info("Room {} in hotel {} marked as available", booking.getRoomId(), booking.getHotelId());
            } else {
                logger.warn("Failed to mark room {} in hotel {} as available", booking.getRoomId(),
                        booking.getHotelId());
            }
        } catch (Exception e) {
            logger.error("Error calling RoomService for room {} in hotel {}: {}", booking.getRoomId(),
                    booking.getHotelId(), e.getMessage(), e);
        }

        sendNotification(booking.getUserId(), "Your booking has been canceled.");
        return canceledBooking;
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

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public boolean isRoomAvailable(Long hotelId, Long roomId,
            LocalDate checkIn, LocalDate checkOut) {
        // Validate dates
        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException("Check-in and check-out dates must not be null");
        }
        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }

        // Query overlapping bookings
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                hotelId, roomId, checkIn, checkOut);

        // If list is empty → room is available
        return overlapping.isEmpty();
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
        if (!room.isEmpty() && room.containsKey("room_type")) {
            dto.setRoomType(room.get("room_type").toString());
        }

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
        if (!room.isEmpty() && room.containsKey("room_type")) {
            dto.setRoomType(room.get("room_type").toString());
        }

        return dto;
    }

    // ------------------- Notification Helper -------------------

    private void sendNotification(Long userId, String message) {
        notificationClient.sendNotification(userId, message);
    }
}