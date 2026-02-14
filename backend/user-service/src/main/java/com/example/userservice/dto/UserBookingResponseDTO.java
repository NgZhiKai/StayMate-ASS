package com.example.userservice.dto;

public class UserBookingResponseDTO {
    private Long bookingId;
    private Long hotelId;
    private Long roomId;
    private String roomType;
    private String status;

    public UserBookingResponseDTO(BookingDTO bookingDto) {
        this.bookingId = bookingDto.getBookingId();
        this.hotelId = bookingDto.getHotelId();
        this.roomId = bookingDto.getRoomId();
        this.roomType = bookingDto.getRoomType();
        this.status = bookingDto.getStatus();
    }

    // Getters & Setters
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}