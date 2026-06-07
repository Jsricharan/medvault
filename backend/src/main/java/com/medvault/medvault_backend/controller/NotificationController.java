package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.dto.NotificationRequestDTO;
import com.medvault.medvault_backend.dto.NotificationResponseDTO;
import com.medvault.medvault_backend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(
        name = "Notifications",
        description = "APIs for managing system " +
                "notifications and alerts"
)
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Operation(
            summary = "Send notification (Admin)",
            description = "Admin sends a notification " +
                    "to any user in the system"
    )
    @PostMapping("/send")
    public ResponseEntity<NotificationResponseDTO>
    sendNotification(
            @RequestBody
            NotificationRequestDTO request) {

        return ResponseEntity.ok(
                notificationService
                        .sendNotification(request)
        );
    }

    @Operation(
            summary = "Get my notifications",
            description = "Returns all notifications " +
                    "for logged in user. " +
                    "Newest first."
    )
    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponseDTO>>
    getMyNotifications(
            Authentication authentication) {

        String userEmail =
                authentication.getName();
        return ResponseEntity.ok(
                notificationService
                        .getMyNotifications(userEmail)
        );
    }

    @Operation(
            summary = "Mark notification as read",
            description = "Marks a specific " +
                    "notification as read"
    )
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO>
    markAsRead(@PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }

    @Operation(
            summary = "Delete notification",
            description = "Permanently deletes a " +
                    "notification"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService
                        .deleteNotification(id)
        );
    }

    @Operation(
            summary = "Get unread count",
            description = "Returns number of unread " +
                    "notifications for logged " +
                    "in user"
    )
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication) {

        String userEmail =
                authentication.getName();
        return ResponseEntity.ok(
                notificationService
                        .getUnreadCount(userEmail)
        );
    }
}