package com.medvault.medvault_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponseDTO {

    private Long id;

    // Patient info
    private Long patientId;
    private String patientName;
    private String patientEmail;

    // Doctor info - can be null
    private Long doctorId;
    private String doctorName;
    private String doctorEmail;

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String status;
    private String notes;
    private boolean doctorAssigned;
    private LocalDateTime createdAt;
}