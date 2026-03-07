package com.example.userservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.userservice.dto.BookmarkRequestDTO;
import com.example.userservice.dto.CustomResponse;
import com.example.userservice.exception.HotelNotFoundException;
import com.example.userservice.exception.InvalidUserException;
import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.service.BookmarkService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/bookmarks")
@Validated
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    /**
     * Add bookmarks for a user (can handle multiple hotels in one request)
     */
    @PostMapping
    public ResponseEntity<CustomResponse<Void>> addBookmarks(@Valid @RequestBody BookmarkRequestDTO dto) {
        try {
            bookmarkService.addBookmarks(dto.getUserId(), dto.getHotelIds());
            return ResponseEntity.ok(new CustomResponse<>("Bookmarks added successfully.", null));
        } catch (UserNotFoundException | HotelNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    /**
     * Get all hotel IDs bookmarked by a user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<CustomResponse<List<Long>>> getBookmarks(@PathVariable Long userId) {
        try {
            List<Long> hotelIds = bookmarkService.getHotelIdsByUserId(userId);
            return ResponseEntity.ok(new CustomResponse<>("Bookmarks retrieved successfully.", hotelIds));
        } catch (UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    /**
     * Remove a bookmark for a user and hotel
     */
    @DeleteMapping("/{userId}/{hotelId}")
    public ResponseEntity<CustomResponse<Void>> removeBookmark(@PathVariable Long userId, @PathVariable Long hotelId) {
        try {
            bookmarkService.removeBookmark(userId, hotelId);
            return ResponseEntity.ok(new CustomResponse<>("Bookmark removed successfully.", null));
        } catch (UserNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }
}
