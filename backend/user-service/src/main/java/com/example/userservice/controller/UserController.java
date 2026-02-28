package com.example.userservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.userservice.dto.CustomResponse;
import com.example.userservice.dto.ResetPasswordRequestDTO;
import com.example.userservice.dto.UserLoginRequestDTO;
import com.example.userservice.dto.UserRequestUpdateDto;
import com.example.userservice.dto.UserResponseDTO;
import com.example.userservice.dto.VerificationResult;
import com.example.userservice.entity.user.User;
import com.example.userservice.entity.user.UserRole;
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

    // ---------------- Initiate Registration ----------------
    @PostMapping("/initiate-registration")
    public ResponseEntity<CustomResponse<String>> initiateRegistration(
            @RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String token = userService.initiateRegistration(email);
            return ResponseEntity.ok(new CustomResponse<>(
                    "Verification email sent to " + email, token));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Verify ----------------
    @PostMapping("/verify")
    public ResponseEntity<CustomResponse<VerificationResult>> verifyUser(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            VerificationResult result = userService.verifyUser(token);

            return ResponseEntity.ok(new CustomResponse<>("Email verified successfully", result));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Registration ----------------
    @PostMapping("/register")
    public ResponseEntity<CustomResponse<UserResponseDTO>> completeRegistration(
            @RequestBody Map<String, String> body) {
        try {
            Long userId = Long.parseLong(body.getOrDefault("id", "0"));
            String firstName = body.get("firstName");
            String lastName = body.get("lastName");
            String phone = body.get("phoneNumber");
            String password = body.get("password");
            String email = body.get("email");

            // Safe role parsing with default
            UserRole role;
            try {
                role = UserRole.valueOf(body.getOrDefault("role", "CUSTOMER"));
            } catch (IllegalArgumentException | NullPointerException e) {
                role = UserRole.CUSTOMER;
            }

            User completedUser = userService.completeRegistration(userId, firstName, lastName, phone, password, email, role);
            UserResponseDTO dto = UserResponseDTO.fromEntity(completedUser);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new CustomResponse<>("Registration completed successfully", dto));

        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        } catch (Exception ex) {
            ex.printStackTrace(); // Log unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new CustomResponse<>("An unexpected error occurred.", null));
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
        List<UserResponseDTO> dtos = users.stream().map(UserResponseDTO::fromEntity).toList();
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

    // ---------------- Forgot Password ----------------
    @PostMapping("/forgot-password")
    public ResponseEntity<CustomResponse<Void>> forgotPassword(
            @RequestParam String email) {

        try {
            userService.sendPasswordReset(email);
            return ResponseEntity.ok(
                    new CustomResponse<>("Password reset link sent to your email.", null));
        } catch (InvalidUserException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

    // ---------------- Forgot Password ----------------
    @PostMapping("/reset-password")
    public ResponseEntity<CustomResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {

        try {
            userService.resetPassword(
                    request.getToken(),
                    request.getNewPassword());

            return ResponseEntity.ok(
                    new CustomResponse<>("Password reset successful.", null));

        } catch (InvalidUserException ex) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new CustomResponse<>(ex.getMessage(), null));
        }
    }

}