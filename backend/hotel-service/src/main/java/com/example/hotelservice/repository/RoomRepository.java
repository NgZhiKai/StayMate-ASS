package com.example.hotelservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.entity.room.RoomId;

@Repository
public interface RoomRepository extends JpaRepository<Room, RoomId> {

    /**
     * Get all rooms for a given hotel ID
     */
    @Query("SELECT r FROM Room r WHERE r.id.hotelId = :hotelId")
    List<Room> findByHotelId(@Param("hotelId") Long hotelId);

}