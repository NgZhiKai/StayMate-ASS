package com.example.hotelservice.entity.room;

import com.example.hotelservice.entity.hotel.Hotel;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("DOUBLE")
public class DoubleRoom extends Room {

    public DoubleRoom() {
        super();
    }

    public DoubleRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, pricePerNight, maxOccupancy);
    }

}
