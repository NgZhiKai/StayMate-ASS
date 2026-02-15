package com.example.hotelservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.hotelservice.client.BookingClient;
import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.entity.room.RoomId;
import com.example.hotelservice.entity.room.RoomStatus;
import com.example.hotelservice.entity.room.RoomType;
import com.example.hotelservice.exception.HotelNotFoundException;
import com.example.hotelservice.exception.RoomAlreadyBookedException;
import com.example.hotelservice.exception.RoomNotFoundException;
import com.example.hotelservice.factory.RoomFactory;
import com.example.hotelservice.repository.HotelRepository;
import com.example.hotelservice.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final BookingClient bookingClient;

    private static final String HOTEL_ID_NOT_NULL = "Hotel ID must not be null";

    public RoomService(RoomRepository roomRepository,
            HotelRepository hotelRepository,
            BookingClient bookingClient) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.bookingClient = bookingClient;
    }

    // ------------------- Room Operations -------------------

    /** Create a new room */
    public Room createRoom(Hotel hotel, Long roomId, RoomType roomType,
            double pricePerNight, int maxOccupancy) {

        Objects.requireNonNull(hotel, "Hotel must not be null");
        Objects.requireNonNull(roomId, "Room ID must not be null");
        Objects.requireNonNull(roomType, "Room type must not be null");

        Room room = RoomFactory.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);
        return Objects.requireNonNull(roomRepository.save(room), "Saved room cannot be null");
    }

    /** Book a room (state pattern logic) */
    public Room bookRoom(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        validateHotelId(hotelId);
        validateDates(checkIn, checkOut);

        Room room = getRoomById(hotelId, roomId);

        if (!bookingClient.isRoomAvailable(hotelId, roomId, checkIn, checkOut)) {
            throw new RoomAlreadyBookedException(
                    "Room " + roomId + " is already booked for selected dates");
        }

        room.book(); // State pattern logic
        return roomRepository.save(room);
    }

    /** Check if a room is available */
    public boolean isRoomAvailable(Long hotelId, Long roomId, LocalDate checkIn, LocalDate checkOut) {
        validateHotelId(hotelId);
        validateDates(checkIn, checkOut);

        if (!roomRepository.existsById(new RoomId(hotelId, roomId))) {
            throw new RoomNotFoundException(
                    "Room " + roomId + " in hotel " + hotelId + " not found.");
        }

        return bookingClient.isRoomAvailable(hotelId, roomId, checkIn, checkOut);
    }

    /** Get all rooms for a hotel */
    public List<Room> getHotelRooms(Long hotelId) {
        validateHotelId(hotelId);
        return roomRepository.findByHotelId(hotelId).stream().toList();
    }

    /** Get available rooms for a hotel within a date range */
    public List<Room> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
        validateHotelId(hotelId);
        validateDates(checkIn, checkOut);

        List<Room> rooms = getHotelRooms(hotelId);
        if (rooms.isEmpty()) {
            throw new RoomNotFoundException("No rooms found for hotel " + hotelId);
        }

        return rooms.stream()
                .filter(room -> bookingClient.isRoomAvailable(hotelId, room.getRoomId(), checkIn, checkOut))
                .toList();
    }

    /** Get a single room by hotelId and roomId */
    public Room getRoomById(Long hotelId, Long roomId) {
        validateHotelId(hotelId);
        Objects.requireNonNull(roomId, "Room ID must not be null");

        return roomRepository.findById(new RoomId(hotelId, roomId))
                .orElseThrow(() -> new RoomNotFoundException(
                        "Room " + roomId + " in hotel " + hotelId + " not found."));
    }

    /** Mark a room as available */
    public void markRoomAvailable(Long hotelId, Long roomId) {
        Room room = getRoomById(hotelId, roomId);
        room.setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(room);
    }

    // ------------------- Hotel Operations -------------------

    public Hotel getHotelById(Long hotelId) {
        validateHotelId(hotelId);
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel with ID " + hotelId + " not found."));
    }

    // ------------------- Validation Helpers -------------------

    private void validateHotelId(Long hotelId) {
        Objects.requireNonNull(hotelId, HOTEL_ID_NOT_NULL);
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        Objects.requireNonNull(checkIn, "Check-in date must not be null");
        Objects.requireNonNull(checkOut, "Check-out date must not be null");
        if (checkOut.isBefore(checkIn)) {
            throw new IllegalArgumentException("Check-out date must be after check-in date");
        }
    }
}