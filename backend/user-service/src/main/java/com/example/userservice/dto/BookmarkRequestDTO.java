package com.example.userservice.dto;

import java.util.List;

public class BookmarkRequestDTO {

    private Long userId;
    private List<Long> hotelIds;

    public BookmarkRequestDTO() {
    }

    public BookmarkRequestDTO(Long userId, List<Long> hotelIds) {
        this.userId = userId;
        this.hotelIds = hotelIds;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getHotelIds() {
        return hotelIds;
    }

    public void setHotelIds(List<Long> hotelIds) {
        this.hotelIds = hotelIds;
    }
}