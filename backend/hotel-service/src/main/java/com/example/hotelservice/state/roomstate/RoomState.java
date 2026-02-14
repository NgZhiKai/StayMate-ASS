package com.example.hotelservice.state.roomstate;

import com.example.hotelservice.entity.room.Room;

public interface RoomState {
    void book(Room room);
    void checkOut(Room room);
    void markUnderMaintenance(Room room);
}
