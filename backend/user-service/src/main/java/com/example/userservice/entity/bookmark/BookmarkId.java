package com.example.userservice.entity.bookmark;

import java.io.Serializable;
import java.util.Objects;

public class BookmarkId implements Serializable {

    private Long userId;
    private Long hotelId;

    public BookmarkId() {
    }

    public BookmarkId(Long userId, Long hotelId) {
        this.userId = userId;
        this.hotelId = hotelId;
    }

    // getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    // equals & hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof BookmarkId))
            return false;
        BookmarkId that = (BookmarkId) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(hotelId, that.hotelId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, hotelId);
    }
}