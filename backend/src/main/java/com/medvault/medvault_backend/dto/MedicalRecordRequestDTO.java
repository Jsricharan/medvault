package com.medvault.medvault_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MedicalRecordRequestDTO {

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String prescription;

    // Medicine schedule as JSON string
    private String medicineSchedule;

    private String notes;
    private String labResults;
}