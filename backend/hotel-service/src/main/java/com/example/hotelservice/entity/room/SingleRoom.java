package com.example.hotelservice.entity.room;

import com.example.hotelservice.entity.hotel.Hotel;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SINGLE")
public class SingleRoom extends Room {

    public SingleRoom() {
        super();
    }

    public SingleRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, pricePerNight, maxOccupancy);
    }
    
}
