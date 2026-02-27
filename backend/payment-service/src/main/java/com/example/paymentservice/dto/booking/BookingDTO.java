package com.example.paymentservice.dto.booking;

import java.time.LocalDate;

public class BookingDTO {
        private Long id; // Booking ID
        private Long userId; // User who made the booking
        private Long hotelId;
        private Long roomId;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Double totalAmount;
        private String status; // BookingStatus as string
        private LocalDate bookingDate;

        // ---------------- Getters & Setters ----------------

        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public Long getUserId() {
                return userId;
        }

        public void setUserId(Long userId) {
                this.userId = userId;
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

        public void setStatus(BookingStatus status) {
                this.status = status != null ? status.name() : null;
        }

        public LocalDate getBookingDate() {
                return bookingDate;
        }

        public void setBookingDate(LocalDate bookingDate) {
                this.bookingDate = bookingDate;
        }
}