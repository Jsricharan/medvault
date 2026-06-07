package com.medvault.medvault_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MedicalRecordResponseDTO {

    private Long id;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private String doctorEmail;
    private String diagnosis;
    private String prescription;
    private String medicineSchedule;
    private String notes;
    private String labResults;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}