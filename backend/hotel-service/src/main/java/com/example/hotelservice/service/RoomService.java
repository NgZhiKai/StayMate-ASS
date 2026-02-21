package com.example.hotelservice.service;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.entity.room.RoomId;
import com.example.hotelservice.entity.room.RoomStatus;
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

    /** Get all rooms for a hotel */
    public List<Room> getHotelRooms(Long hotelId) {
        validateHotelId(hotelId);
        return roomRepository.findByHotelId(hotelId).stream().toList();
    }

    /** Get a single room by hotelId and roomId */
    public Room getRoomById(Long hotelId, Long roomId) {
        validateHotelId(hotelId);
        Objects.requireNonNull(roomId, "Room ID must not be null");

        return roomRepository.findById(new RoomId(hotelId, roomId))
                .orElseThrow(() -> new RoomNotFoundException(
                        "Room " + roomId + " in hotel " + hotelId + " not found."));
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
}