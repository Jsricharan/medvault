package com.medvault.medvault_backend.repository;

import com.medvault.medvault_backend.entity.Notification;
import com.medvault.medvault_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Get all notifications for a specific user
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // Get only unread notifications for a user
    List<Notification> findByUserAndIsRead(User user, boolean isRead);

    // Count unread notifications
    long countByUserAndIsRead(User user, boolean isRead);
}