package com.example.hotelservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.exception.HotelNotFoundException;
import com.example.hotelservice.exception.RoomNotFoundException;
import com.example.hotelservice.service.RoomService;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/rooms")
@Tag(name = "Room Controller", description = "API for managing hotel rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    /** Get all rooms for a hotel */
    @GetMapping("/{hotelId}")
    public ResponseEntity<List<Room>> getHotelRooms(@PathVariable Long hotelId) {
        List<Room> rooms = roomService.getHotelRooms(hotelId);
        if (rooms.isEmpty()) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.ok(rooms);
    }

    /** Get a single room by hotelId and roomId */
    @GetMapping("/{hotelId}/{roomId}")
    public ResponseEntity<Room> getRoomById(
            @PathVariable Long hotelId,
            @PathVariable Long roomId) {

        try {
            Room room = roomService.getRoomById(hotelId, roomId);
            return ResponseEntity.ok(room);
        } catch (RoomNotFoundException | HotelNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}