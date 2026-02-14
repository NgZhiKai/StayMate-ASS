package com.example.hotelservice.entity.room;

import com.example.hotelservice.entity.hotel.Hotel;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SUITE")
public class SuiteRoom extends Room {

    public SuiteRoom() {
        super();
    }

    public SuiteRoom(Hotel hotel, Long roomId, double pricePerNight, int maxOccupancy) {
        super(hotel, roomId, pricePerNight, maxOccupancy);
    }

}
