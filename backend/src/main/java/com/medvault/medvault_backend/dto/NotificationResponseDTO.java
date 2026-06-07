package com.medvault.medvault_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDTO {

    private Long id;
    private String message;
    private boolean isRead;
    private String userName;
    private String userEmail;
    private LocalDateTime createdAt;
}