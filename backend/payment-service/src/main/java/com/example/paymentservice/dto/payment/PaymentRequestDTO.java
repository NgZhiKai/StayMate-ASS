package com.example.paymentservice.dto.payment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PaymentRequestDTO {
    @NotNull(message = "Booking ID is required.")
    private Long bookingId;

    @Positive(message = "Payment amount must be greater than zero.")
    private double amount;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

}
