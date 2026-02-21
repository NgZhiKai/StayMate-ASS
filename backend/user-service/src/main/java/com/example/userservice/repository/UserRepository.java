package com.example.userservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.userservice.entity.user.User;
import com.example.userservice.entity.user.UserRole;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find user by email
    Optional<User> findByEmail(String email);

    // Find users by role
    List<User> findByRole(UserRole role);

    // Search by last name containing substring
    List<User> findByLastNameContaining(String lastName);

    // Find by verification token
    Optional<User> findByVerificationToken(String verificationToken);

    // Get all users that are not deleted
    @Query("SELECT u FROM User u WHERE u.isDeleted = false")
    List<User> findAllActiveUsers();
}