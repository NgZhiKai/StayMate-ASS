package com.example.userservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.userservice.entity.bookmark.Bookmark;
import com.example.userservice.entity.bookmark.BookmarkId;

public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkId> {
    
    @Query("SELECT b.hotelId FROM Bookmark b WHERE b.userId = :userId")
    List<Long> findHotelIdsByUserId(Long userId);

    void deleteByUserIdAndHotelId(Long userId, Long hotelId);
}
