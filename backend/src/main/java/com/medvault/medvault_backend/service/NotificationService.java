package com.medvault.medvault_backend.service;

import com.medvault.medvault_backend.dto.NotificationRequestDTO;
import com.medvault.medvault_backend.dto.NotificationResponseDTO;
import com.medvault.medvault_backend.entity.Notification;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.NotificationRepository;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Send a notification to a user
    public NotificationResponseDTO sendNotification(
            NotificationRequestDTO request) {

        // Find user by ID
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        // Create notification
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(request.getMessage());
        notification.setRead(false);

        // Save to database
        Notification saved = notificationRepository.save(notification);

        return mapToResponseDTO(saved);
    }

    // Get all notifications for logged in user
    public List<NotificationResponseDTO> getMyNotifications(
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Mark a notification as read
    public NotificationResponseDTO markAsRead(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found!"));

        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);

        return mapToResponseDTO(updated);
    }

    // Delete a notification
    public String deleteNotification(Long notificationId) {

        Notification notification = notificationRepository
                .findById(notificationId)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found!"));

        notificationRepository.delete(notification);

        return "Notification deleted successfully!";
    }

    // Get unread notifications count
    public long getUnreadCount(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        return notificationRepository.countByUserAndIsRead(user, false);
    }

    // Helper - convert Notification to NotificationResponseDTO
    private NotificationResponseDTO mapToResponseDTO(
            Notification notification) {

        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setUserName(notification.getUser().getFullName());
        dto.setUserEmail(notification.getUser().getEmail());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}