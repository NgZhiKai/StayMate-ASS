package com.example.userservice.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.userservice.client.EmailClient;
import com.example.userservice.dto.CompleteRegistrationRequestDTO;
import com.example.userservice.dto.EmailRequestDTO;
import com.example.userservice.dto.UserRequestUpdateDto;
import com.example.userservice.dto.VerificationResult;
import com.example.userservice.entity.user.User;
import com.example.userservice.entity.user.UserRole;
import com.example.userservice.exception.InvalidUserException;
import com.example.userservice.exception.ResourceNotFoundException;
import com.example.userservice.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final String baseUrl;
    private final EmailClient emailClient;

    // ---------------- Constructor Injection ----------------
    public UserService(UserRepository userRepository,
            @Value("${app.base-url:http://localhost:5173}") String baseUrl,
            EmailClient emailClient) {
        this.userRepository = userRepository;
        this.baseUrl = baseUrl;
        this.emailClient = emailClient;
    }

    public String initiateRegistration(String email) {
        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
        } else {
            user = new User();
            user.setEmail(email);
            user.setVerified(false);
            user.setDeleted(false);
            user.setRole(UserRole.CUSTOMER);

            user = userRepository.save(user);
        }

        String token = generateVerificationToken(user);
        sendEmail(email, token, "verification", "/verify?token=");

        return token;
    }

    public User completeRegistration(CompleteRegistrationRequestDTO request) {
        if (request == null) {
            throw new InvalidUserException("Registration payload cannot be null.");
        }
        Long userId = request.getId() != null ? request.getId() : 0L;
        UserRole role = parseRoleOrDefault(request.getRole(), UserRole.CUSTOMER);

        User user;

        if (userId == 0) {
            user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setPassword(request.getPassword());
            user.setEmail(request.getEmail());
            user.setVerified(true);
            user.setRole(role != null ? role : UserRole.CUSTOMER);

            return userRepository.save(user);

        } else {
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new InvalidUserException("User not found"));

            if (!user.isVerified()) {
                throw new InvalidUserException("Email not verified yet.");
            }

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setPassword(request.getPassword());

            // Keep existing role if present, or use provided role
            if (user.getRole() == null) {
                user.setRole(role != null ? role : UserRole.CUSTOMER);
            }

            return userRepository.save(user);
        }
    }

    // ---------------- User Registration ----------------
    public User registerUser(User user) {
        if (user == null)
            throw new InvalidUserException("User cannot be null.");
        if (userRepository.findByEmail(user.getEmail()).isPresent())
            throw new InvalidUserException("Email is already registered.");

        user.setVerified(false);
        user.setDeleted(false);
        if (user.getRole() == null)
            user.setRole(UserRole.CUSTOMER);

        User savedUser = userRepository.save(user);

        String token = generateVerificationToken(savedUser);
        sendEmail(user.getEmail(), token, "verification", "/verify?token=");

        return savedUser;
    }

    // ---------------- Get Users ----------------
    public List<User> getAllUsers() {
        return userRepository.findAllActiveUsers();
    }

    public User getUserById(Long id) {
        if (id == null)
            throw new InvalidUserException("User ID cannot be null.");
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID " + id));
    }

    public User getUserByEmail(String email) {
        if (email == null || email.isBlank())
            throw new InvalidUserException("Email cannot be null or empty.");
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email " + email));
    }

    public List<User> getUsersByRole(UserRole role) {
        if (role == null)
            throw new InvalidUserException("Role cannot be null.");
        return userRepository.findByRole(role);
    }

    // ---------------- Update User ----------------
    @Transactional
    public User updateUser(Long id, UserRequestUpdateDto updatedUser) {
        User existingUser = getUserById(id);

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existingUser.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(existingUser);
    }

    // ---------------- Delete User ----------------
    public void deleteUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null || user.isDeleted()) {
            return;
        }

        user.setDeleted(true);
        user.setEmail(null);
        userRepository.save(user);
    }

    // ---------------- Verification ----------------
    public String generateVerificationToken(User user) {
        if (user == null)
            throw new InvalidUserException("User cannot be null when generating token.");
        String token = UUID.randomUUID().toString();
        user.setVerified(false);
        user.setVerificationToken(token);
        userRepository.save(user);
        return token;
    }

    public VerificationResult verifyUser(String token) {
        // 1. Find the user by token
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new InvalidUserException("Invalid or expired token"));

        // 2. Check if user is newly created or already existed
        String tokenType = user.isNewlyCreated() ? "NEW_USER" : "EXISTING_USER";

        // 3. Mark user as verified
        user.setVerified(true);
        userRepository.save(user);

        return new VerificationResult(user.getId(), tokenType);
    }

    // ---------------- Login ----------------
    public String loginUser(String email, String password) {
        User user = getUserByEmail(email);
        if (!user.checkPassword(password))
            throw new InvalidUserException("Invalid email or password.");
        if (!user.isVerified())
            throw new InvalidUserException("Email not verified.");

        return ensureLoginToken(user);
    }

    public void sendPasswordReset(String email) {
        User user = getUserByEmail(email);

        String resetToken = generateVerificationToken(user);
        sendEmail(user.getEmail(), resetToken, "reset", "/reset?token=");
    }

    public void resetPassword(String token, String newPassword) {

        // 1. Find the user by token
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new InvalidUserException("Invalid or expired token"));

        user.setPassword(newPassword);
        userRepository.save(user);
    }

    private UserRole parseRoleOrDefault(String roleValue, UserRole defaultRole) {
        if (roleValue == null || roleValue.isBlank()) {
            return defaultRole;
        }
        try {
            return UserRole.valueOf(roleValue.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return defaultRole;
        }
    }

    private void sendEmail(String email, String token, String type, String pathPrefix) {
        String verificationLink = baseUrl + pathPrefix + token;
        EmailRequestDTO emailRequest = new EmailRequestDTO(email, token, type, verificationLink);
        emailClient.sendEmail(emailRequest);
    }

    private String ensureLoginToken(User user) {
        String existingToken = user.getVerificationToken();
        if (existingToken != null && !existingToken.isBlank()) {
            return existingToken;
        }

        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);
        return token;
    }

}
