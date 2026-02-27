package com.example.notificationservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.notificationservice.entity.Notification;
import com.example.notificationservice.entity.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Get all notifications for a specific user
    List<Notification> findByUserId(Long userId);

    // Get notifications by user and read/unread status
    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);

    // Get notifications by user and type
    List<Notification> findByUserIdAndType(Long userId, NotificationType type);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId AND n.isRead = false")
    int markAllAsReadByUserId(@Param("userId") Long userId);
}