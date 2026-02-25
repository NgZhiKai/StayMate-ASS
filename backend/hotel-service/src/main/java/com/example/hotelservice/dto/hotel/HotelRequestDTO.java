package com.example.hotelservice.dto.hotel;

import java.time.LocalTime;
import java.util.List;

import com.example.hotelservice.dto.room.RoomRequestDTO;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelRequestDTO {
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private List<RoomRequestDTO> rooms;
    private String description;
    private String contact;
    private String city;
    private String country;

    @JsonDeserialize(using = LocalTimeDeserializer.class)
    private LocalTime checkIn;

    @JsonDeserialize(using = LocalTimeDeserializer.class)
    private LocalTime checkOut;
}