package com.example.userservice.entity.bookmark;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@IdClass(BookmarkId.class)
@Table(name = "bookmark")
public class Bookmark implements Serializable {

    @Id
    @Column(name = "userid", nullable = false)
    private Long userId;

    @Id
    @Column(name = "hotelid", nullable = false)
    private Long hotelId;

    public Bookmark() {
    }

    public Bookmark(Long userId, Long hotelId) {
        this.userId = userId;
        this.hotelId = hotelId;
    }

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
}