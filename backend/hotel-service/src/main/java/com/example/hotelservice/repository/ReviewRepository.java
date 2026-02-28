package com.example.hotelservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hotelservice.entity.review.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Find reviews by hotel id
    List<Review> findByHotelId(Long hotelId);

    // Find reviews by user id
    List<Review> findByUserId(Long userId);

    // Find reviews by hotel id and user id
    List<Review> findByHotelIdAndUserId(Long hotelId, Long userId);

    // Delete all reviews for a hotel
    void deleteByHotelId(Long hotelId);
}
