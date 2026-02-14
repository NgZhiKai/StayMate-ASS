package com.example.userservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.example.userservice.dto.*;
import com.example.userservice.entity.User;
import com.example.userservice.exception.InvalidUserException;
import com.example.userservice.exception.ResourceNotFoundException;
import com.example.userservice.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    private final UserService userService;

    // ---------------- Constructor Injection ----------------
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ---------------- Register ----------------
    @PostMapping("/register")
    public ResponseEntity<CustomResponse<User>> registerUser(
            @Valid @RequestBody UserCreationRequestDTO userDto) {
        try {
            User user = new User(
                    userDto.getFirstName(),
                    userDto.getLastName(),
                    userDto.getEmail(),
                    userDto.getPassword(),
                    userDto.getPhoneNumber(),
                    userDto.getRole()
            );

            User savedUser = userService.registerUser(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("User registered successfully. Check your email for verification.",
                            savedUser));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Login ----------------
    @PostMapping("/login")
    public ResponseEntity<CustomResponse<Map<String, Object>>> loginUser(
            @Valid @RequestBody UserLoginRequestDTO loginDto) {
        try {
            String token = userService.loginUser(loginDto.getEmail(), loginDto.getPassword(), loginDto.getRole());
            User user = userService.getUserByEmail(loginDto.getEmail());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("user", user);

            return ResponseEntity.ok(new CustomResponse<>("Login successful", responseData));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Get All Users ----------------
    @GetMapping
    public ResponseEntity<CustomResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new CustomResponse<>("Users retrieved successfully", users));
    }

    // ---------------- Get User by ID ----------------
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", user));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Get User by Email ----------------
    @GetMapping("/by-email/{email}")
    public ResponseEntity<CustomResponse<User>> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", user));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Update User ----------------
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<User>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestUpdateDto dto) {
        try {
            User existingUser = userService.getUserById(id);
            existingUser.setFirstName(dto.getFirstName());
            existingUser.setLastName(dto.getLastName());
            existingUser.setEmail(dto.getEmail());
            existingUser.setPhoneNumber(dto.getPhoneNumber());
            if (dto.getPassword() != null && !dto.getPassword().isBlank())
                existingUser.setPassword(dto.getPassword());

            User updatedUser = userService.updateUser(id, existingUser);
            return ResponseEntity.ok(new CustomResponse<>("User updated successfully", updatedUser));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Delete User ----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<CustomResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(new CustomResponse<>("User deleted successfully", null));
        } catch (ResourceNotFoundException | InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Verify User ----------------
    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        boolean verified = userService.verifyUser(token);
        if (verified) {
            return ResponseEntity.ok("User verified successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }
    }

    // ---------------- Get User Bookings ----------------
    // @GetMapping("/{id}/bookings")
    // public ResponseEntity<CustomResponse<List<UserBookingResponseDTO>>> getUserBookings(@PathVariable Long id) {
    //     try {
    //         List<UserBookingResponseDTO> bookings = userService.getUserBookings(id);
    //         return ResponseEntity.ok(new CustomResponse<>("User bookings retrieved successfully", bookings));
    //     } catch (ResourceNotFoundException ex) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND)
    //                 .body(new CustomResponse<>(ex.getMessage(), null));
    //     } catch (Exception ex) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //                 .body(new CustomResponse<>("Failed to retrieve bookings: " + ex.getMessage(), null));
    //     }
    // }
}