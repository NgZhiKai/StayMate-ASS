package com.example.hotelservice.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelservice.entity.room.Room;
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

    /**
     * Get all rooms for a hotel
     */
    @GetMapping("/{hotelId}")
    public ResponseEntity<List<Room>> getHotelRooms(@PathVariable Long hotelId) {
        List<Room> rooms = roomService.getHotelRooms(hotelId);

        if (rooms.isEmpty()) {
            // Hotel exists but has no rooms
            return ResponseEntity.noContent().build(); // 204 No Content
        }

        return ResponseEntity.ok(rooms);
    }

    /**
     * Get available rooms for a hotel within a date range
     */
    // @GetMapping("/available")
    // public ResponseEntity<List<Room>> getAvailableRooms(
    //         @RequestParam Long hotelId,
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

    //     if (checkOutDate.isBefore(checkInDate)) {
    //         return ResponseEntity.badRequest().body(null);
    //     }

    //     List<Room> availableRooms = roomService.getAvailableRooms(hotelId, checkInDate, checkOutDate);

    //     if (availableRooms.isEmpty()) {
    //         return ResponseEntity.noContent().build(); // 204 No Content if none available
    //     }

    //     return ResponseEntity.ok(availableRooms);
    // }
}