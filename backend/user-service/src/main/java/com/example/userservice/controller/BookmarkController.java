package com.example.userservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.userservice.dto.BookmarkRequestDTO;
import com.example.userservice.service.BookmarkService;

@RestController
@RequestMapping("/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    /**
     * Add bookmarks for a user (can handle multiple hotels in one request)
     */
    @PostMapping
    public ResponseEntity<String> addBookmarks(@RequestBody BookmarkRequestDTO dto) {
        bookmarkService.addBookmarks(dto.getUserId(), dto.getHotelIds());
        return ResponseEntity.ok("Bookmarks added successfully.");
    }

    /**
     * Get all hotel IDs bookmarked by a user
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Long>> getBookmarks(@PathVariable Long userId) {
        List<Long> hotelIds = bookmarkService.getHotelIdsByUserId(userId);
        return ResponseEntity.ok(hotelIds);
    }

    /**
     * Remove a bookmark for a user and hotel
     */
    @DeleteMapping("/{userId}/{hotelId}")
    @Transactional
    public ResponseEntity<String> removeBookmark(@PathVariable Long userId, @PathVariable Long hotelId) {
        bookmarkService.removeBookmark(userId, hotelId);
        return ResponseEntity.ok("Bookmark removed successfully.");
    }
}