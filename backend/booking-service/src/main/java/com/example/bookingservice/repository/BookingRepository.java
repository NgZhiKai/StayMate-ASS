package com.example.bookingservice.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.bookingservice.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

        // ------------------- Basic Queries -------------------

        List<Booking> findByUserId(Long userId);

        List<Booking> findByHotelId(Long hotelId);

        // ------------------- Availability -------------------

        /**
         * Find overlapping bookings for a specific room in a hotel.
         * Only considers bookings that are not CANCELLED.
         */
        @Query("""
                            SELECT b FROM Booking b
                            WHERE b.hotelId = :hotelId
                              AND b.roomId = :roomId
                              AND b.status <> com.example.bookingservice.entity.BookingStatus.CANCELLED
                              AND b.checkInDate < :checkOut
                              AND b.checkOutDate > :checkIn
                        """)
        List<Booking> findOverlappingBookings(
                        @Param("hotelId") Long hotelId,
                        @Param("roomId") Long roomId,
                        @Param("checkIn") LocalDate checkIn,
                        @Param("checkOut") LocalDate checkOut);

        // ------------------- Search by Date Range -------------------

        /**
         * Fetch all bookings that overlap with a given date range and are not
         * cancelled.
         */
        @Query("""
                            SELECT b FROM Booking b
                            WHERE b.checkInDate <= :endDate
                            AND b.checkOutDate >= :startDate
                            AND b.status <> com.example.bookingservice.entity.BookingStatus.CANCELLED
                        """)
        List<Booking> findBookingsByDateRange(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);
}