package com.example.bookingservice.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
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
    private static final String HOTEL_ID_REQUIRED_MESSAGE = "Hotel ID is required";
    private static final String USER_ID_REQUIRED_MESSAGE = "User ID is required";
    private static final String ROOM_ID_REQUIRED_MESSAGE = "Room ID is required";
    private static final String BOOKING_ID_REQUIRED_MESSAGE = "Booking ID is required";
    private static final String ROOM_SELECTION_REQUIRED_MESSAGE = "At least one room must be selected";
    private static final String CHECKOUT_AFTER_CHECKIN_MESSAGE = "Check-out date must be after check-in date";

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

        long days = ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
        if (days <= 0) {
            throw new IllegalArgumentException(CHECKOUT_AFTER_CHECKIN_MESSAGE);
        }

        List<Booking> createdBookings = new ArrayList<>();
        Long safeHotelId = requireHotelId(dto.getHotelId());
        Long safeUserId = requireUserId(dto.getUserId());

        for (Long roomId : dto.getRoomIds()) {
            Long safeRoomId = requireRoomId(roomId);

            if (!isRoomAvailable(safeHotelId, safeRoomId,
                    dto.getCheckInDate(), dto.getCheckOutDate())) {

                throw new IllegalStateException(
                        "Room " + safeRoomId + " is not available");
            }

            BigDecimal totalRoomAmount = calculateTotalRoomAmount(safeHotelId, safeRoomId, days);
            Booking booking = buildBooking(dto, safeHotelId, safeRoomId, safeUserId, totalRoomAmount);

            createdBookings.add(bookingRepository.save(booking));
        }

        sendNotification(safeUserId, "Your booking is pending confirmation.");

        return createdBookings;
    }

    @Transactional
    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = getBookingById(requireBookingId(bookingId));
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
        Booking booking = getBookingById(requireBookingId(bookingId));
        if (booking == null)
            return null;

        booking.setStatus(BookingStatus.CANCELLED);
        Booking canceled = bookingRepository.save(booking);
        sendNotification(booking.getUserId(), "Your booking has been canceled.");
        return canceled;
    }

    // ------------------- Read Operations -------------------

    public @Nullable Booking getBookingById(Long id) {
        return bookingRepository.findById(requireBookingId(id)).orElse(null);
    }

    public List<BookingResponseDTO> getBookingsByHotel(Long hotelId) {
        return bookingRepository.findByHotelId(requireHotelId(hotelId)).stream()
                .filter(Objects::nonNull)
                .map(this::mapToBookingResponseDTO)
                .toList();
    }

    public List<UserBookingResponseDTO> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(requireUserId(userId)).stream()
                .filter(Objects::nonNull)
                .map(this::mapToUserBookingResponseDTO)
                .toList();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ------------------- Availability -------------------

    public boolean isRoomAvailable(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new IllegalArgumentException("Invalid check-in/check-out dates");
        }
        return bookingRepository.findOverlappingBookings(
                requireHotelId(hotelId),
                requireRoomId(roomId),
                checkIn,
                checkOut)
                .isEmpty();
    }

    public List<Map<String, Object>> getAvailableRoomsForHotel(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        Long safeHotelId = requireHotelId(hotelId);

        List<Booking> overlappingBookings = bookingRepository.findByHotelId(safeHotelId).stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED
                        && b.getCheckInDate().isBefore(checkOut)
                        && b.getCheckOutDate().isAfter(checkIn))
                .toList();

        List<Long> bookedRoomIds = overlappingBookings.stream()
                .map(Booking::getRoomId)
                .map(this::requireRoomId)
                .toList();

        List<Map<String, Object>> allRooms = roomClient.getRoomsByHotelId(safeHotelId);

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

    private BookingResponseDTO mapToBookingResponseDTO(@NonNull Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(b.getId());
        dto.setHotelId(b.getHotelId());
        dto.setRoomId(b.getRoomId());
        dto.setCheckInDate(b.getCheckInDate());
        dto.setCheckOutDate(b.getCheckOutDate());
        dto.setStatus(b.getStatus() != null ? b.getStatus().toString() : null);
        dto.setTotalAmount(b.getTotalAmount());

        Map<String, Object> user = userClient.getUserById(
                requireUserId(b.getUserId()));
        dto.setFirstName((String) user.getOrDefault("firstName", null));
        dto.setLastName((String) user.getOrDefault("lastName", null));
        dto.setEmail((String) user.getOrDefault("email", null));
        dto.setPhone((String) user.getOrDefault("phoneNumber", null));

        Map<String, Object> room = roomClient.getRoomById(
                requireHotelId(b.getHotelId()),
                requireRoomId(b.getRoomId()));
        dto.setRoomType(room.getOrDefault("room_type", "").toString());

        return dto;
    }

    private UserBookingResponseDTO mapToUserBookingResponseDTO(@NonNull Booking b) {
        UserBookingResponseDTO dto = new UserBookingResponseDTO();
        dto.setBookingId(b.getId());
        dto.setHotelId(b.getHotelId());
        dto.setRoomId(b.getRoomId());
        dto.setCheckInDate(b.getCheckInDate());
        dto.setCheckOutDate(b.getCheckOutDate());
        dto.setStatus(b.getStatus() != null ? b.getStatus().toString() : null);

        Map<String, Object> room = roomClient.getRoomById(
                requireHotelId(b.getHotelId()),
                requireRoomId(b.getRoomId()));
        dto.setRoomType(room.getOrDefault("room_type", "").toString());

        return dto;
    }

    // ------------------- Helpers -------------------

    private void sendNotification(Long userId, String message) {
        try {
            notificationClient.sendNotification(requireUserId(userId), message);
        } catch (Exception e) {
            logger.warn("Failed to send notification: {}", e.getMessage());
        }
    }

    private void validateBookingRequest(BookingRequestDTO dto) {

        if (dto.getHotelId() == null)
            throw new IllegalArgumentException(HOTEL_ID_REQUIRED_MESSAGE);

        if (dto.getUserId() == null)
            throw new IllegalArgumentException(USER_ID_REQUIRED_MESSAGE);

        if (dto.getRoomIds() == null || dto.getRoomIds().isEmpty())
            throw new IllegalArgumentException(ROOM_SELECTION_REQUIRED_MESSAGE);

        if (dto.getRoomIds().stream().anyMatch(Objects::isNull))
            throw new IllegalArgumentException("Room ID list contains null values");

        if (dto.getCheckInDate() == null || dto.getCheckOutDate() == null)
            throw new IllegalArgumentException("Check-in and check-out dates are required");

        if (!dto.getCheckOutDate().isAfter(dto.getCheckInDate()))
            throw new IllegalArgumentException(CHECKOUT_AFTER_CHECKIN_MESSAGE);
    }

    private @NonNull Long requireHotelId(@Nullable Long hotelId) {
        return Objects.requireNonNull(hotelId, HOTEL_ID_REQUIRED_MESSAGE);
    }

    private @NonNull Long requireUserId(@Nullable Long userId) {
        return Objects.requireNonNull(userId, USER_ID_REQUIRED_MESSAGE);
    }

    private @NonNull Long requireRoomId(@Nullable Long roomId) {
        return Objects.requireNonNull(roomId, ROOM_ID_REQUIRED_MESSAGE);
    }

    private @NonNull Long requireBookingId(@Nullable Long bookingId) {
        return Objects.requireNonNull(bookingId, BOOKING_ID_REQUIRED_MESSAGE);
    }

    private BigDecimal calculateTotalRoomAmount(Long hotelId, Long roomId, long days) {
        Map<String, Object> room = roomClient.getRoomById(hotelId, roomId);
        if (room.isEmpty() || !room.containsKey("pricePerNight")) {
            throw new IllegalStateException("Cannot fetch price for room " + roomId);
        }
        BigDecimal roomPrice = new BigDecimal(room.get("pricePerNight").toString());
        return roomPrice.multiply(BigDecimal.valueOf(days));
    }

    private Booking buildBooking(
            BookingRequestDTO dto,
            Long hotelId,
            Long roomId,
            Long userId,
            BigDecimal totalRoomAmount) {
        Booking booking = new Booking();
        booking.setHotelId(hotelId);
        booking.setRoomId(roomId);
        booking.setUserId(userId);
        booking.setCheckInDate(dto.getCheckInDate());
        booking.setCheckOutDate(dto.getCheckOutDate());
        booking.setTotalAmount(totalRoomAmount);
        booking.setBookingDate(LocalDate.now());
        booking.setStatus(BookingStatus.PENDING);
        return booking;
    }
}
