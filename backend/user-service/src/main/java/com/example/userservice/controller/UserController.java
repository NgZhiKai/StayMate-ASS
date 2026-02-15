package com.example.userservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.userservice.dto.CustomResponse;
import com.example.userservice.dto.UserCreationRequestDTO;
import com.example.userservice.dto.UserLoginRequestDTO;
import com.example.userservice.dto.UserRequestUpdateDto;
import com.example.userservice.dto.UserResponseDTO;
import com.example.userservice.entity.user.User;
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
    public ResponseEntity<CustomResponse<UserResponseDTO>> registerUser(
            @Valid @RequestBody UserCreationRequestDTO userDto) {
        try {
            User user = new User(
                    userDto.getFirstName(),
                    userDto.getLastName(),
                    userDto.getEmail(),
                    userDto.getPassword(),
                    userDto.getPhoneNumber(),
                    userDto.getRole());

            User savedUser = userService.registerUser(user);
            UserResponseDTO responseDTO = UserResponseDTO.fromEntity(savedUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("User registered successfully. Check your email for verification.",
                            responseDTO));
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
            UserResponseDTO responseDTO = UserResponseDTO.fromEntity(user);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("user", responseDTO);

            return ResponseEntity.ok(new CustomResponse<>("Login successful", responseData));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Get All Users ----------------
    @GetMapping
    public ResponseEntity<CustomResponse<List<UserResponseDTO>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponseDTO> dtos = users.stream().map(UserResponseDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(new CustomResponse<>("Users retrieved successfully", dtos));
    }

    // ---------------- Get User by ID ----------------
    @GetMapping("/{id}")
    public ResponseEntity<CustomResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            UserResponseDTO dto = UserResponseDTO.fromEntity(user);
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", dto));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Get User by Email ----------------
    @GetMapping("/by-email/{email}")
    public ResponseEntity<CustomResponse<UserResponseDTO>> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            UserResponseDTO dto = UserResponseDTO.fromEntity(user);
            return ResponseEntity.ok(new CustomResponse<>("User retrieved successfully", dto));
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Update User ----------------
    @PutMapping("/{id}")
    public ResponseEntity<CustomResponse<UserResponseDTO>> updateUser(
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
            UserResponseDTO responseDTO = UserResponseDTO.fromEntity(updatedUser);
            return ResponseEntity.ok(new CustomResponse<>("User updated successfully", responseDTO));
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
            return ResponseEntity.ok(new CustomResponse<>("User deleted successfully", null));
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
}