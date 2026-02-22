package com.example.paymentservice.dto.booking;

import java.time.LocalDate;

public class UserBookingDTO {
        private Long bookingId; // Booking ID
        private Long hotelId;
        private Long roomId;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private String roomType;
        private Double totalAmount;
        private String status;

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

        public LocalDate getCheckInDate() {
                return checkInDate;
        }

        public void setCheckInDate(LocalDate checkInDate) {
                this.checkInDate = checkInDate;
        }

        public LocalDate getCheckOutDate() {
                return checkOutDate;
        }

        public void setCheckOutDate(LocalDate checkOutDate) {
                this.checkOutDate = checkOutDate;
        }

        public Double getTotalAmount() {
                return totalAmount;
        }

        public void setTotalAmount(Double totalAmount) {
                this.totalAmount = totalAmount;
        }

        public String getStatus() {
                return status;
        }

        public void setStatus(String status) {
                this.status = status;
        }

        public String getRoomType() {
                return roomType;
        }

        public void setRoomType(String roomType) {
                this.roomType = roomType;
        }

}