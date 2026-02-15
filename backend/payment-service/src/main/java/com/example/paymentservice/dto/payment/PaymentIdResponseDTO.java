package com.example.paymentservice.dto.payment;

import java.time.LocalDateTime;

import com.example.paymentservice.entity.Payment;
import com.example.paymentservice.entity.PaymentStatus;

public class PaymentIdResponseDTO {
    private Long paymentId;
    private Long bookingId;
    private double amountPaid;
    private PaymentStatus paymentStatus;
    private LocalDateTime paymentDateTime;

    public PaymentIdResponseDTO(Payment payment) {
        this.paymentId = payment.getId();
        this.bookingId = payment.getBookingId();
        this.amountPaid = payment.getAmount();
        this.paymentStatus = payment.getStatus();
        this.paymentDateTime = payment.getTransactionDate();
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaymentDateTime() {
        return paymentDateTime;
    }

    public void setPaymentDateTime(LocalDateTime paymentDateTime) {
        this.paymentDateTime = paymentDateTime;
    }
}