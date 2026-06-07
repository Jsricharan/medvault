package com.medvault.medvault_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String role;

    // Optional
    private String specialization;
    private String gender;
    private Integer age;
    private String bloodGroup;
}