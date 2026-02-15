package com.example.hotelservice.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.hotelservice.dto.custom.CustomResponse;
import com.example.hotelservice.dto.hotel.HotelRequestDTO;
import com.example.hotelservice.dto.room.RoomRequestDTO;
import com.example.hotelservice.entity.hotel.Hotel;
import com.example.hotelservice.entity.room.Room;
import com.example.hotelservice.service.HotelService;
import com.example.hotelservice.service.RoomService;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.NonNull;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    private final HotelService hotelService;
    private final RoomService roomService;
    private final ObjectMapper objectMapper;

    private static final String MESSAGE_KEY = "message";
    private static final String HOTEL_ID_KEY = "hotelId";

    public HotelController(HotelService hotelService,
            RoomService roomService,
            ObjectMapper objectMapper) {
        this.hotelService = hotelService;
        this.roomService = roomService;
        this.objectMapper = objectMapper;
    }

    // ---------------- Create Hotel ----------------
    @Operation(summary = "Create a new hotel", description = "This operation creates a new hotel and its rooms")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomResponse<Map<String, Object>>> createHotel(
            @RequestPart("hotelDetails") String hotelDetailsJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        HotelRequestDTO hotelRequestDTO = objectMapper.readValue(hotelDetailsJson, HotelRequestDTO.class);

        if (hotelRequestDTO.getName() == null || hotelRequestDTO.getName().isBlank()) {
            throw new IllegalArgumentException("Hotel name is required");
        }

        Hotel hotel = new Hotel();
        hotel.setName(hotelRequestDTO.getName());
        hotel.setAddress(hotelRequestDTO.getAddress());
        hotel.setDescription(hotelRequestDTO.getDescription());
        hotel.setLatitude(hotelRequestDTO.getLatitude());
        hotel.setLongitude(hotelRequestDTO.getLongitude());
        hotel.setContact(hotelRequestDTO.getContact());
        hotel.setCheckIn(hotelRequestDTO.getCheckIn());
        hotel.setCheckOut(hotelRequestDTO.getCheckOut());

        if (image != null && !image.isEmpty()) {
            hotel.setImage(image.getBytes());
        }

        Hotel savedHotel = hotelService.saveHotel(hotel);
        Long hotelId = Objects.requireNonNull(savedHotel.getId(), "Saved hotel ID cannot be null");

        List<Room> rooms = new ArrayList<>();
        long roomIdCounter = 100;

        if (hotelRequestDTO.getRooms() != null) {
            for (RoomRequestDTO roomRequest : hotelRequestDTO.getRooms()) {
                if (roomRequest.getQuantity() <= 0) {
                    throw new IllegalArgumentException("Room quantity must be greater than zero");
                }
                for (int i = 0; i < roomRequest.getQuantity(); i++) {
                    Room room = roomService.createRoom(
                            savedHotel,
                            roomIdCounter++,
                            roomRequest.getRoomType(),
                            roomRequest.getPricePerNight(),
                            roomRequest.getMaxOccupancy());
                    rooms.add(room);
                }
            }
        }

        savedHotel.setRooms(rooms);

        Map<String, Object> response = Map.of(
                MESSAGE_KEY, "Hotel created successfully",
                HOTEL_ID_KEY, hotelId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>("Hotel created successfully", response));
    }

    // ---------------- Get All Hotels ----------------
    @Operation(summary = "Get all hotels", description = "Retrieve a list of all hotels")
    @GetMapping
    public ResponseEntity<CustomResponse<List<Hotel>>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();

        if (hotels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No hotels found", null));
        }

        return ResponseEntity.ok(
                new CustomResponse<>("Hotels retrieved successfully", hotels));
    }

    // ---------------- Get Hotel by ID ----------------
    @Operation(summary = "Get hotel by ID", description = "Retrieve a hotel by its ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<Hotel>> getHotelById(
            @Parameter(description = "ID of the hotel to retrieve") @PathVariable @NonNull Long id) {

        Hotel hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(
                new CustomResponse<>("Hotel retrieved successfully", hotel));
    }

    // ---------------- Update Hotel ----------------
    @Operation(summary = "Update hotel details", description = "Update the information of an existing hotel")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CustomResponse<Map<String, Object>>> updateHotel(
            @Parameter(description = "ID of the hotel to update") @PathVariable @NonNull Long id,
            @RequestPart("hotelDetails") String hotelDetailsJson,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        Hotel existingHotel = hotelService.getHotelById(id);

        HotelRequestDTO hotelRequestDTO = objectMapper.readValue(hotelDetailsJson, HotelRequestDTO.class);

        existingHotel.setName(hotelRequestDTO.getName());
        existingHotel.setAddress(hotelRequestDTO.getAddress());
        existingHotel.setDescription(hotelRequestDTO.getDescription());
        existingHotel.setLatitude(hotelRequestDTO.getLatitude());
        existingHotel.setLongitude(hotelRequestDTO.getLongitude());
        existingHotel.setContact(hotelRequestDTO.getContact());
        existingHotel.setCheckIn(hotelRequestDTO.getCheckIn());
        existingHotel.setCheckOut(hotelRequestDTO.getCheckOut());

        if (image != null && !image.isEmpty()) {
            existingHotel.setImage(image.getBytes());
        }

        Hotel updatedHotel = hotelService.saveHotel(existingHotel);
        Long hotelId = Objects.requireNonNull(updatedHotel.getId(), "Updated hotel ID cannot be null");

        Map<String, Object> response = Map.of(
                MESSAGE_KEY, "Hotel updated successfully",
                HOTEL_ID_KEY, hotelId);

        return ResponseEntity.ok(
                new CustomResponse<>("Hotel updated successfully", response));
    }

    // ---------------- Delete Hotel ----------------
    @Operation(summary = "Delete hotel by ID", description = "Delete a hotel by its ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Map<String, Object>>> deleteHotel(
            @Parameter(description = "ID of the hotel to delete") @PathVariable @NonNull Long id) {

        hotelService.getHotelById(id); // validate existence
        hotelService.deleteHotel(id);

        Map<String, Object> response = Map.of(
                MESSAGE_KEY, "Hotel deleted successfully",
                HOTEL_ID_KEY, id);

        return ResponseEntity.ok(
                new CustomResponse<>("Hotel deleted successfully", response));
    }

    // ---------------- Search Hotels by Name ----------------
    @Operation(summary = "Search hotels by name", description = "Search for hotels by their name")
    @GetMapping("/search")
    public ResponseEntity<CustomResponse<List<Hotel>>> searchHotelsByName(@RequestParam String name) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Search query cannot be empty");
        }

        List<Hotel> hotels = hotelService.findHotelsByName(name);

        if (hotels.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>("No hotels found", null));
        }

        return ResponseEntity.ok(
                new CustomResponse<>("Hotels found successfully", hotels));
    }

    // ---------------- Get Hotel Rooms ----------------
    @Operation(summary = "Get hotel rooms", description = "Get all rooms for a specific hotel")
    @GetMapping("/{id}/rooms")
    public ResponseEntity<CustomResponse<List<Room>>> getHotelRooms(@PathVariable @NonNull Long id) {
        hotelService.getHotelById(id); // validate hotel exists
        List<Room> rooms = roomService.getHotelRooms(id); // updated RoomService method
        return ResponseEntity.ok(
                new CustomResponse<>("Rooms retrieved successfully", rooms));
    }

    // ---------------- Get Nearby Hotels ----------------
    @Operation(summary = "Get hotels within 10 km", description = "Returns hotels within a 10 km radius of the current location")
    @GetMapping("/nearby")
    public ResponseEntity<List<Hotel>> getHotelsNearby(@RequestParam double latitude,
            @RequestParam double longitude) {
        return ResponseEntity.ok(
                hotelService.getNearbyHotels(latitude, longitude));
    }
}