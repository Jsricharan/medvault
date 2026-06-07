package com.medvault.medvault_backend.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {

    private String fullName;
    private String phone;
    private String specialization;
    private Boolean enabled;
    private String gender;
    private Integer age;
    private String bloodGroup;

    // Hospital details - no consultation fee
    private String hospitalName;
    private String hospitalAddress;
    private String hospitalCity;
    private String experience;
}