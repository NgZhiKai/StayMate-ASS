package com.example.hotelservice.entity.room;

import com.example.hotelservice.entity.hotel.Hotel;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DELUXE")
public class DeluxeRoom extends Room {

    public DeluxeRoom() {
        super();
    }

    public DeluxeRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, pricePerNight, maxOccupancy);
    }
    
}
