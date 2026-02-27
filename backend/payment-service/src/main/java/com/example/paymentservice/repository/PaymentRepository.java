package com.example.paymentservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.paymentservice.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payments by booking ID
    List<Payment> findByBookingId(Long bookingId);

    // Sum of successful payments for a booking
    @Query("SELECT COALESCE(SUM(p.amount), 0.0) FROM Payment p WHERE p.bookingId = :bookingId AND p.status = 'SUCCESS'")
    Optional<Double> findTotalPaidAmountByBookingId(@Param("bookingId") Long bookingId);

}