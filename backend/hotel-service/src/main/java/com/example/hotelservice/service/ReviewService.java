package com.example.hotelservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotelservice.dto.review.ReviewDTO;
import com.example.hotelservice.entity.review.Review;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.repository.ReviewRepository;

@Service
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // ==================== CREATE ====================

    public Review createReview(ReviewDTO dto) {
        validateDTO(dto);

        Review review = new Review();
        review.setHotelId(dto.getHotelId());
        review.setUserId(dto.getUserId());
        review.setComment(dto.getComment());
        review.setRating(dto.getRating());
        review.setCreatedAt(
                dto.getCreated() != null ? dto.getCreated() : LocalDateTime.now());

        return reviewRepository.save(review);
    }

    // ==================== UPDATE ====================

    public Review updateReview(Long id, ReviewDTO dto) {
        validateDTO(dto);

        Review existingReview = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        // Update only allowed fields
        existingReview.setComment(dto.getComment());
        existingReview.setRating(dto.getRating());

        return reviewRepository.save(existingReview);
    }

    // ==================== READ ====================

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
    }

    // ==================== DELETE ====================

    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        reviewRepository.delete(review);
    }

    public void deleteReviewsByHotelId(Long hotelId) {
        Objects.requireNonNull(hotelId, "Hotel ID must be provided.");
        reviewRepository.deleteByHotelId(hotelId);
    }

    // ==================== FILTERS ====================

    @Transactional(readOnly = true)
    public List<Review> findReviewsByHotelId(Long hotelId) {
        Objects.requireNonNull(hotelId, "Hotel ID must be provided.");
        return reviewRepository.findByHotelId(hotelId);
    }

    @Transactional(readOnly = true)
    public List<Review> findReviewsByUserId(Long userId) {
        Objects.requireNonNull(userId, "User ID must be provided.");
        return reviewRepository.findByUserId(userId);
    }

    // ==================== VALIDATION ====================

    private void validateDTO(ReviewDTO dto) {
        Objects.requireNonNull(dto, "ReviewDTO cannot be null.");
        Objects.requireNonNull(dto.getHotelId(), "Hotel ID must be provided.");
        Objects.requireNonNull(dto.getUserId(), "User ID must be provided.");

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
    }
}
