package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.dto.MedicalRecordRequestDTO;
import com.medvault.medvault_backend.dto.MedicalRecordResponseDTO;
import com.medvault.medvault_backend.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(
        name = "Medical Records",
        description = "APIs for managing patient " +
                "medical records and prescriptions"
)
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Operation(
            summary = "Create medical record (Doctor)",
            description = "Doctor creates a medical " +
                    "record with diagnosis, " +
                    "prescription and medicine " +
                    "schedule for a patient"
    )
    @PostMapping("/create")
    public ResponseEntity<MedicalRecordResponseDTO>
    createRecord(
            @RequestBody
            MedicalRecordRequestDTO request,
            Authentication authentication) {

        String doctorEmail =
                authentication.getName();
        return ResponseEntity.ok(
                medicalRecordService
                        .createRecord(doctorEmail, request)
        );
    }

    @Operation(
            summary = "Get my records (Patient)",
            description = "Patient views their own " +
                    "medical records and " +
                    "prescriptions"
    )
    @GetMapping("/my")
    public ResponseEntity<List<MedicalRecordResponseDTO>>
    getMyRecords(
            Authentication authentication) {

        String patientEmail =
                authentication.getName();
        return ResponseEntity.ok(
                medicalRecordService
                        .getMyRecords(patientEmail)
        );
    }

    @Operation(
            summary = "Get patient records (Doctor)",
            description = "Doctor views a specific " +
                    "patient's full medical history"
    )
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponseDTO>>
    getPatientRecords(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                medicalRecordService
                        .getPatientRecords(patientId)
        );
    }

    @Operation(
            summary = "Get all records (Admin)",
            description = "Admin views all medical " +
                    "records in the system"
    )
    @GetMapping("/all")
    public ResponseEntity<List<MedicalRecordResponseDTO>>
    getAllRecords() {

        return ResponseEntity.ok(
                medicalRecordService.getAllRecords()
        );
    }

    @Operation(
            summary = "Update medical record",
            description = "Doctor updates an existing " +
                    "medical record"
    )
    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecordResponseDTO>
    updateRecord(
            @PathVariable Long id,
            @RequestBody
            MedicalRecordRequestDTO request) {

        return ResponseEntity.ok(
                medicalRecordService
                        .updateRecord(id, request)
        );
    }

    @Operation(
            summary = "Delete medical record (Admin)",
            description = "Admin permanently deletes " +
                    "a medical record"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecord(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                medicalRecordService.deleteRecord(id)
        );
    }
}