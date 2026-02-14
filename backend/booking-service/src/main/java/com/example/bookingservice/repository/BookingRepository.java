package com.example.bookingservice.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.bookingservice.entity.booking.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        // Find bookings by user ID
        List<Booking> findByUserId(Long userId);

        // Find bookings by hotel ID
        List<Booking> findByHotelId(Long hotelId);

        // Find overlapping bookings for a specific room in a hotel
        @Query("SELECT b FROM Booking b WHERE b.hotelId = :hotelId AND b.roomId = :roomId " +
                        "AND (b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate)")
        List<Booking> findOverlappingBookings(
                        @Param("hotelId") Long hotelId,
                        @Param("roomId") Long roomId,
                        @Param("checkInDate") LocalDate checkInDate,
                        @Param("checkOutDate") LocalDate checkOutDate);
}