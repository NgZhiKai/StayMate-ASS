package com.example.userservice.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.userservice.client.EmailClient;
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
            @Value("${frontend.host-url}") String baseUrl,
            EmailClient emailClient) {
        this.userRepository = userRepository;
        this.baseUrl = baseUrl;
        this.emailClient = emailClient;
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
        String verificationLink = baseUrl + "/verify?token=" + token;

        // Send verification email via EmailClient
        emailClient.sendVerificationEmail(savedUser.getEmail(), token, verificationLink);

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
    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUserById(id);

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        existingUser.setRole(updatedUser.getRole());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existingUser.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(existingUser);
    }

    // ---------------- Delete User ----------------
    public void deleteUser(Long id) {
        try {
            userRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            User user = getUserById(id);
            user.setDeleted(true);
            user.setEmail(null);
            userRepository.save(user);
        }
    }

    // ---------------- Verification ----------------
    public String generateVerificationToken(User user) {
        if (user == null)
            throw new InvalidUserException("User cannot be null when generating token.");
        String token = UUID.randomUUID().toString();
        user.setVerificationToken(token);
        userRepository.save(user);
        return token;
    }

    public boolean verifyUser(String token) {
        if (token == null || token.isBlank())
            throw new InvalidUserException("Verification token cannot be null or empty.");
        User user = userRepository.findByVerificationToken(token);
        if (user == null || user.isVerified())
            return false;
        user.setVerified(true);
        userRepository.save(user);
        return true;
    }

    // ---------------- Login ----------------
    public String loginUser(String email, String password, String role) {
        User user = getUserByEmail(email);
        if (!user.checkPassword(password))
            throw new InvalidUserException("Invalid email or password.");
        if (!user.isVerified())
            throw new InvalidUserException("Email not verified.");

        UserRole requestedRole = UserRole.valueOf(role.toUpperCase());
        if (!requestedRole.equals(user.getRole()))
            throw new InvalidUserException("Role mismatch.");

        // Return verification token (replace with JWT in production)
        return generateVerificationToken(user);
    }

}