package com.example.hotelservice.exception;

public class HotelNotFoundException extends RuntimeException {

    public HotelNotFoundException(Long id) {
        super("Hotel with ID " + id + " not found.");
    }

    public HotelNotFoundException(String message) {
        super(message);
    }
}