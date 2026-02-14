package com.example.hotelservice.factory;

import com.example.hotelservice.entity.room.RoomType;
import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.DeluxeRoom;
import com.example.hotelservice.entity.room.DoubleRoom;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.entity.room.SingleRoom;
import com.example.hotelservice.entity.room.SuiteRoom;

public class RoomFactory {

    // Private constructor to prevent instantiation
    private RoomFactory() {
        throw new UnsupportedOperationException("RoomFactory cannot be instantiated");
    }

    public static Room createRoom(Hotel hotel, Long roomId, RoomType roomType, double pricePerNight, int maxOccupancy) {
        return switch (roomType) {
            case SINGLE -> new SingleRoom(hotel, roomId, pricePerNight, maxOccupancy);
            case DOUBLE -> new DoubleRoom(hotel, roomId, pricePerNight, maxOccupancy);
            case DELUXE -> new DeluxeRoom(hotel, roomId, pricePerNight, maxOccupancy);
            case SUITE -> new SuiteRoom(hotel, roomId, pricePerNight, maxOccupancy);
        };
    }
}