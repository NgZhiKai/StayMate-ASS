package com.example.userservice.exception;

public class HotelNotFoundException extends RuntimeException {
    public HotelNotFoundException(Long hotelId) {
        super("Hotel not found with ID: " + hotelId);
    }
}
