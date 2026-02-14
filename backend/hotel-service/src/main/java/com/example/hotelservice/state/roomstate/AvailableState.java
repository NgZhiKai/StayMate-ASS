package com.example.hotelservice.state.roomstate;

import com.example.hotelservice.entity.room.RoomStatus;
import com.example.hotelservice.entity.room.Room;

public class AvailableState implements RoomState {
    @Override
    public void book(Room room) {
        room.setStatus(RoomStatus.BOOKED);
    }

    @Override
    public void checkOut(Room room) {
        throw new IllegalStateException("Room is already available.");
    }

    @Override
    public void markUnderMaintenance(Room room) {
        room.setStatus(RoomStatus.UNDER_MAINTENANCE);
    }
}
