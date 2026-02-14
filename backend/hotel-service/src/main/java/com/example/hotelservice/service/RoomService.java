package com.example.hotelservice.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

// import com.example.hotelservice.entity.booking.Booking;
import com.example.hotelservice.entity.room.RoomType;
import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.entity.room.RoomId;
import com.example.hotelservice.exception.RoomAlreadyBookedException;
import com.example.hotelservice.exception.RoomNotFoundException;
import com.example.hotelservice.exception.HotelNotFoundException;
import com.example.hotelservice.factory.RoomFactory;
// import com.example.hotelservice.repository.BookingRepository;
import com.example.hotelservice.repository.HotelRepository;
import com.example.hotelservice.repository.RoomRepository;

import io.micrometer.common.lang.NonNull;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    // private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;

    private static final String HOTEL_ID_NOT_NULL = "Hotel ID must not be null";


    // Constructor injection
    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        // this.bookingRepository = bookingRepository;
        this.hotelRepository = hotelRepository;
    }

    // Create a new room
    public Room createRoom(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        Room room = RoomFactory.createRoom(hotel, roomId, roomType, pricePerNight, maxOccupancy);
        return roomRepository.save(room);
    }

    // Book a room
    // public Room bookRoom(Long hotelId, Long roomId, LocalDate checkInDate,
    // LocalDate checkOutDate) {
    // RoomId id = new RoomId(hotelId, roomId);

    // Room room = roomRepository.findById(id)
    // .orElseThrow(() -> new RoomNotFoundException(
    // "Room " + roomId + " in hotel " + hotelId + " not found."));

    // List<Booking> overlappingBookings =
    // bookingRepository.findOverlappingBookings(hotelId, roomId, checkInDate,
    // checkOutDate);

    // if (!overlappingBookings.isEmpty()) {
    // throw new RoomAlreadyBookedException(
    // "Room " + roomId + " in hotel " + hotelId + " is already booked for the
    // selected dates.");
    // }

    // room.book();
    // return roomRepository.save(room);
    // }

    // // Check if a room is available
    // public boolean isRoomAvailable(Long hotelId, Long roomId, LocalDate
    // checkInDate, LocalDate checkOutDate) {
    // RoomId id = new RoomId(hotelId, roomId);
    // Room room = roomRepository.findById(id)
    // .orElseThrow(() -> new RoomNotFoundException(
    // "Room " + roomId + " in hotel " + hotelId + " not found."));

    // List<Booking> overlappingBookings =
    // bookingRepository.findOverlappingBookings(hotelId, roomId, checkInDate,
    // checkOutDate);
    // return overlappingBookings.isEmpty();
    // }

    public Hotel getHotelById(@NonNull Long hotelId) {
        Objects.requireNonNull(hotelId, HOTEL_ID_NOT_NULL);
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new HotelNotFoundException("Hotel with ID " + hotelId + " not found."));
    }

    // Get all rooms for a hotel
    public List<Room> getHotelRooms(@NonNull Long hotelId) {
       Objects.requireNonNull(hotelId, HOTEL_ID_NOT_NULL);
        return roomRepository.findByHotelId(hotelId);
    }

    public List<Room> getRoomsByHotelId(@NonNull Long hotelId) {
        Objects.requireNonNull(hotelId, HOTEL_ID_NOT_NULL);
        return getHotelRooms(hotelId);
    }

    // Get available rooms for a hotel
    // public List<Room> getAvailableRooms(Long hotelId, LocalDate checkIn, LocalDate checkOut) {
    //     return roomRepository.findAvailableRooms(hotelId, checkIn, checkOut);
    // }
}