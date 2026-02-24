package com.example.userservice.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.userservice.client.EmailClient;
import com.example.userservice.dto.EmailRequestDTO;
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
            @Value("${frontend.host.url}") String baseUrl,
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
        String verificationLink = baseUrl + "/verify?token=" + token;

        // Send email with token
        EmailRequestDTO emailRequest = new EmailRequestDTO(email, token, "verification", verificationLink);
        emailClient.sendEmail(emailRequest);

        return token;
    }

    public User completeRegistration(Long userId, String firstName, String lastName, String phone, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidUserException("User not found"));

        if (!user.isVerified()) {
            throw new InvalidUserException("Email not verified yet.");
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phone);
        user.setPassword(password);

        return userRepository.save(user);
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
        EmailRequestDTO emailRequest = new EmailRequestDTO(user.getEmail(), token, "verification", verificationLink);
        emailClient.sendEmail(emailRequest);

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
    public String loginUser(String email, String password, String role) {
        User user = getUserByEmail(email);
        if (!user.checkPassword(password))
            throw new InvalidUserException("Invalid email or password.");
        if (!user.isVerified())
            throw new InvalidUserException("Email not verified.");
        
        return user.getVerificationToken();
    }

    public void sendPasswordReset(String email) {
        User user = getUserByEmail(email);

        String resetToken = generateVerificationToken(user);
        String verificationLink = baseUrl + "/reset?token=" + resetToken;

        user.setVerificationToken(resetToken);
        userRepository.save(user);

        EmailRequestDTO emailRequest = new EmailRequestDTO(user.getEmail(), resetToken, "reset", verificationLink);
        emailClient.sendEmail(emailRequest);
    }

    public void resetPassword(String token, String newPassword) {

        // 1. Find the user by token
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new InvalidUserException("Invalid or expired token"));

        user.setPassword(newPassword);
        userRepository.save(user);
    }

}