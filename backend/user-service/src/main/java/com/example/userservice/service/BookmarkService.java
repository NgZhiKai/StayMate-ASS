package com.example.userservice.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.userservice.client.HotelClient;
import com.example.userservice.entity.bookmark.Bookmark;
import com.example.userservice.exception.HotelNotFoundException;
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
    public void addBookmarks(Long userId, List<Long> hotelIds) {
        // Validate user exists
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }

        // Get existing bookmarks to skip duplicates
        Set<Long> existingHotelIds = bookmarkRepository.findHotelIdsByUserId(userId)
                .stream().collect(Collectors.toSet());

        // Filter out hotels already bookmarked
        List<Long> newHotelIds = hotelIds.stream()
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
        return bookmarkRepository.findHotelIdsByUserId(userId);
    }

    /**
     * Remove a bookmark by user and hotel ID
     */
    public void removeBookmark(Long userId, Long hotelId) {
        bookmarkRepository.deleteByUserIdAndHotelId(userId, hotelId);
    }
}