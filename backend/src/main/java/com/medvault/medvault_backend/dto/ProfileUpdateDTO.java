package com.medvault.medvault_backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateDTO {

    private String phone;
    private String currentPassword;
    private String newPassword;
    private String profilePicture;
}