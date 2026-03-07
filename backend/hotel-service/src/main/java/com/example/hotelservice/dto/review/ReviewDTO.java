package com.example.hotelservice.dto.review;

import java.time.LocalDateTime;
import com.example.hotelservice.entity.review.Review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReviewDTO {

    @NotNull(message = "Hotel ID must be provided.")
    private Long hotelId;
    @NotNull(message = "User ID must be provided.")
    private Long userId;
    private String comment;
    private LocalDateTime created;
    @Min(value = 1, message = "Rating must be between 1 and 5.")
    @Max(value = 5, message = "Rating must be between 1 and 5.")
    private int rating;

    public ReviewDTO() {
    }

    public ReviewDTO(Long hotelId, Long userId, String comment, LocalDateTime created, int rating) {
        this.hotelId = hotelId;
        this.userId = userId;
        this.comment = comment;
        this.created = created;
        this.rating = rating;
    }

    /**
     * Convert Review entity → ReviewDTO
     */
    public static ReviewDTO convertToDTO(Review review) {
        if (review == null) {
            return null;
        }

        ReviewDTO dto = new ReviewDTO();
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());

        if (review.getHotelId() != null) {
            dto.setHotelId(review.getHotelId());
        }

        if (review.getUserId() != null) {
            dto.setUserId(review.getUserId());
        }

        return dto;
    }

    // Getters & Setters

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
