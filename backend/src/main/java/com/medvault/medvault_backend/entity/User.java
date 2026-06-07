package com.medvault.medvault_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // Account status - controlled by admin
    @Column(nullable = false,
            columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean enabled = true;

    // Doctor availability - controlled by doctor
    // Default is ACTIVE/AVAILABLE
    @Column(nullable = false,
            columnDefinition = "TINYINT(1) DEFAULT 1")
    private boolean available = true;

    @Column
    private String specialization;

    @Column
    private String gender;

    @Column
    private Integer age;

    @Column(length = 20)
    private String bloodGroup;

    @Column
    private String hospitalName;

    @Column
    private String hospitalAddress;

    @Column
    private String hospitalCity;

    @Column
    private String experience;

    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        // Always set defaults on creation
        if (!isEnabled()) enabled = true;
        if (!isAvailable()) available = true;
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}