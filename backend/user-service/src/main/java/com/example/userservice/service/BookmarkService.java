package com.example.userservice.service;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.userservice.client.HotelClient;
import com.example.userservice.entity.bookmark.Bookmark;
import com.example.userservice.exception.HotelNotFoundException;
import com.example.userservice.exception.InvalidUserException;
import com.example.userservice.exception.UserNotFoundException;
import com.example.userservice.repository.BookmarkRepository;
import com.example.userservice.repository.UserRepository;

@Service
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final HotelClient hotelClient;

    public BookmarkService(BookmarkRepository bookmarkRepository,
            UserRepository userRepository,
            HotelClient hotelClient) {
        this.bookmarkRepository = bookmarkRepository;
        this.userRepository = userRepository;
        this.hotelClient = hotelClient;
    }

    /**
     * Batch add bookmarks for a user. Ignores duplicates.
     */
    @Transactional
    public void addBookmarks(Long userId, List<Long> hotelIds) {
        validateUserExists(userId);
        validateHotelIds(hotelIds);

        // Get existing bookmarks to skip duplicates
        Set<Long> existingHotelIds = bookmarkRepository.findHotelIdsByUserId(userId)
                .stream().collect(Collectors.toSet());

        // Filter out hotels already bookmarked
        List<Long> newHotelIds = hotelIds.stream()
                .filter(Objects::nonNull)
                .distinct()
                .filter(id -> !existingHotelIds.contains(id))
                .toList();

        // Validate hotels exist and map to Bookmark entities
        List<Bookmark> bookmarksToSave = newHotelIds.stream().map(hotelId -> {
            HotelClient.HotelResponse hotel = hotelClient.getHotelById(hotelId);
            if (hotel == null) {
                throw new HotelNotFoundException(hotelId);
            }
            return new Bookmark(userId, hotelId); // Use ID only
        }).toList();

        // Save all new bookmarks
        if (!bookmarksToSave.isEmpty()) {
            bookmarkRepository.saveAll(bookmarksToSave);
        }
    }

    /**
     * Get all hotel IDs bookmarked by a user
     */
    public List<Long> getHotelIdsByUserId(Long userId) {
        validateUserExists(userId);
        return bookmarkRepository.findHotelIdsByUserId(userId);
    }

    /**
     * Remove a bookmark by user and hotel ID
     */
    @Transactional
    public void removeBookmark(Long userId, Long hotelId) {
        validateUserExists(userId);
        if (hotelId == null || hotelId <= 0) {
            throw new InvalidUserException("Hotel ID must be a positive number.");
        }
        bookmarkRepository.deleteByUserIdAndHotelId(userId, hotelId);
    }

    private void validateUserExists(Long userId) {
        if (userId == null || userId <= 0) {
            throw new InvalidUserException("User ID must be a positive number.");
        }
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }
    }

    private void validateHotelIds(List<Long> hotelIds) {
        if (hotelIds == null || hotelIds.isEmpty()) {
            throw new InvalidUserException("At least one hotel ID is required.");
        }
        boolean hasInvalidId = hotelIds.stream().anyMatch(id -> id == null || id <= 0);
        if (hasInvalidId) {
            throw new InvalidUserException("Hotel IDs must be positive numbers.");
        }
    }
}
