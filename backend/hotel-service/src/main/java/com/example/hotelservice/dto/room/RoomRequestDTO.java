package com.example.hotelservice.dto.room;

import com.example.hotelservice.entity.room.RoomType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequestDTO {
    private RoomType roomType;
    private double pricePerNight;
    private int maxOccupancy;
    private int quantity; // Number of rooms to create
}