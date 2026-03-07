package com.example.hotelservice.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.hotelservice.dto.room.RoomRequestDTO;
import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.entity.room.RoomId;
import com.example.hotelservice.entity.room.RoomType;
import com.example.hotelservice.exception.HotelNotFoundException;
import com.example.hotelservice.exception.RoomNotFoundException;
import com.example.hotelservice.factory.RoomFactory;
import com.example.hotelservice.repository.HotelRepository;
import com.example.hotelservice.repository.RoomRepository;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    private static final String HOTEL_ID_NOT_NULL = "Hotel ID must not be null";
    private static final String ROOM_ID_NOT_NULL = "Room ID must not be null";
    private static final String ROOM_QUANTITY_INVALID = "Room quantity must be greater than zero";

    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
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

    public List<Room> createRoomsForHotel(Hotel hotel, List<RoomRequestDTO> roomRequests) {
        Objects.requireNonNull(hotel, "Hotel must not be null");
        if (roomRequests == null || roomRequests.isEmpty()) {
            return List.of();
        }

        List<Room> rooms = new ArrayList<>();
        long roomIdCounter = 100;

        for (RoomRequestDTO roomRequest : roomRequests) {
            if (roomRequest == null) {
                continue;
            }
            if (roomRequest.getQuantity() <= 0) {
                throw new IllegalArgumentException(ROOM_QUANTITY_INVALID);
            }
            for (int i = 0; i < roomRequest.getQuantity(); i++) {
                Room room = createRoom(
                        hotel,
                        roomIdCounter++,
                        roomRequest.getRoomType(),
                        roomRequest.getPricePerNight(),
                        roomRequest.getMaxOccupancy());
                rooms.add(room);
            }
        }

        return rooms;
    }

    /** Get all rooms for a hotel */
    public List<Room> getHotelRooms(Long hotelId) {
        Long safeHotelId = validateHotelId(hotelId);
        getHotelById(safeHotelId);
        return roomRepository.findByHotelId(safeHotelId);
    }

    /** Get a single room by hotelId and roomId */
    public Room getRoomById(Long hotelId, Long roomId) {
        Long safeHotelId = validateHotelId(hotelId);
        Long safeRoomId = validateRoomId(roomId);
        getHotelById(safeHotelId);

        return roomRepository.findById(new RoomId(safeHotelId, safeRoomId))
                .orElseThrow(() -> new RoomNotFoundException(
                        "Room " + safeRoomId + " in hotel " + safeHotelId + " not found."));
    }

    // ------------------- Hotel Operations -------------------

    public Hotel getHotelById(Long hotelId) {
        Long safeHotelId = validateHotelId(hotelId);
        return hotelRepository.findById(safeHotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel with ID " + safeHotelId + " not found."));
    }

    // ------------------- Validation Helpers -------------------

    private Long validateHotelId(Long hotelId) {
        return Objects.requireNonNull(hotelId, HOTEL_ID_NOT_NULL);
    }

    private Long validateRoomId(Long roomId) {
        return Objects.requireNonNull(roomId, ROOM_ID_NOT_NULL);
    }
}
