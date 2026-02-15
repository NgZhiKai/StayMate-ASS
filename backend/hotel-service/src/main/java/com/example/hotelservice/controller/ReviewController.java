package com.example.hotelservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelservice.dto.custom.CustomResponse;
import com.example.hotelservice.dto.review.ReviewDTO;
import com.example.hotelservice.entity.review.Review;
import com.example.hotelservice.exception.ResourceNotFoundException;
import com.example.hotelservice.service.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ==================== GET ALL ====================

    @Operation(summary = "Get all reviews")
    @GetMapping
    public ResponseEntity<CustomResponse<List<ReviewDTO>>> getAllReviews() {

        List<ReviewDTO> reviewDTOs = reviewService.getAllReviews()
                .stream()
                .map(ReviewDTO::convertToDTO)
                .toList();

        return ResponseEntity.ok(
                new CustomResponse<>("Reviews retrieved successfully", reviewDTOs));
    }

    // ==================== GET BY ID ====================

    @Operation(summary = "Get review by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<ReviewDTO>> getReviewById(
            @Parameter(description = "Review ID") @PathVariable Long id) {

        Review review = reviewService.getReviewById(id);

        if (review == null) {
            throw new ResourceNotFoundException("Review not found for id: " + id);
        }

        return ResponseEntity.ok(
                new CustomResponse<>("Review retrieved successfully",
                        ReviewDTO.convertToDTO(review)));
    }

    // ==================== CREATE ====================

    @Operation(summary = "Create review")
    @PostMapping
    public ResponseEntity<CustomResponse<ReviewDTO>> createReview(
            @RequestBody ReviewDTO reviewDTO) {

        Review savedReview = reviewService.createReview(reviewDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>("Review created successfully",
                        ReviewDTO.convertToDTO(savedReview)));
    }

    // ==================== UPDATE ====================

    @Operation(summary = "Update review")
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<ReviewDTO>> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewDTO reviewDTO) {

        Review updatedReview = reviewService.updateReview(id, reviewDTO);

        return ResponseEntity.ok(
                new CustomResponse<>("Review updated successfully",
                        ReviewDTO.convertToDTO(updatedReview)));
    }

    // ==================== DELETE ====================

    @Operation(summary = "Delete review")
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<String>> deleteReview(@PathVariable Long id) {

        reviewService.deleteReview(id);

        return ResponseEntity.ok(
                new CustomResponse<>("Review deleted successfully",
                        "Review with id " + id + " was deleted"));
    }

    // ==================== GET BY HOTEL ====================

    @Operation(summary = "Get reviews by hotel ID")
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<CustomResponse<List<ReviewDTO>>> getReviewsByHotelId(
            @PathVariable Long hotelId) {

        List<ReviewDTO> reviewDTOs = reviewService.findReviewsByHotelId(hotelId)
                .stream()
                .map(ReviewDTO::convertToDTO)
                .toList();

        return ResponseEntity.ok(
                new CustomResponse<>("Reviews retrieved successfully", reviewDTOs));
    }
}