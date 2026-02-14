package com.example.hotelservice.entity.room;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

@Embeddable
public class RoomId implements Serializable {
    private Long hotelId;
    private Long roomId;

    public RoomId() {}
    public RoomId(Long hotelId, Long roomId) {
        this.hotelId = hotelId;
        this.roomId = roomId;
    }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    // equals & hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoomId)) return false;
        RoomId other = (RoomId) o;
        return hotelId.equals(other.hotelId) && roomId.equals(other.roomId);
    }

    @Override
    public int hashCode() { return hotelId.hashCode() + roomId.hashCode(); }
}