package com.example.hotelservice.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.exception.HotelNotFoundException;
import com.example.hotelservice.exception.RoomNotFoundException;
import com.example.hotelservice.service.RoomService;

import io.swagger.v3.oas.annotations.Operation;
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

    /** Get available rooms for a hotel within a date range */
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms(
            @RequestParam Long hotelId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

        try {
            List<Room> availableRooms = roomService.getAvailableRooms(hotelId, checkInDate, checkOutDate);

            if (availableRooms.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(availableRooms);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (HotelNotFoundException | RoomNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
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

    /** Mark a room as available */
    @PutMapping("/{hotelId}/{roomId}/available")
    public ResponseEntity<Void> markRoomAvailable(@PathVariable Long hotelId,
            @PathVariable Long roomId) {
        try {
            roomService.markRoomAvailable(hotelId, roomId);
            return ResponseEntity.ok().build();
        } catch (RoomNotFoundException | HotelNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}