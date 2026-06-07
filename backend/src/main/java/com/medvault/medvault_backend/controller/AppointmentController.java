package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.dto.AppointmentRequestDTO;
import com.medvault.medvault_backend.dto.AppointmentResponseDTO;
import com.medvault.medvault_backend.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(
        name = "Appointments",
        description = "APIs for booking and managing " +
                "appointments"
)
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Operation(
            summary = "Book an appointment",
            description = "Patient books appointment. " +
                    "Doctor is optional — if not " +
                    "selected, admin assigns one"
    )
    @PostMapping("/book")
    public ResponseEntity<AppointmentResponseDTO>
    bookAppointment(
            @RequestBody
            AppointmentRequestDTO request,
            Authentication authentication) {

        String patientEmail =
                authentication.getName();
        AppointmentResponseDTO response =
                appointmentService.bookAppointment(
                        patientEmail, request
                );
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get my appointments (Patient)",
            description = "Returns all appointments " +
                    "for logged in patient. " +
                    "Newest first."
    )
    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponseDTO>>
    getMyAppointments(
            Authentication authentication) {

        String patientEmail =
                authentication.getName();
        return ResponseEntity.ok(
                appointmentService
                        .getMyAppointments(patientEmail)
        );
    }

    @Operation(
            summary = "Get doctor appointments",
            description = "Returns all appointments " +
                    "for logged in doctor. " +
                    "Newest first."
    )
    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentResponseDTO>>
    getDoctorAppointments(
            Authentication authentication) {

        String doctorEmail =
                authentication.getName();
        return ResponseEntity.ok(
                appointmentService
                        .getDoctorAppointments(doctorEmail)
        );
    }

    @Operation(
            summary = "Update appointment status",
            description = "Update status to: CONFIRMED, " +
                    "CANCELLED, or COMPLETED. " +
                    "Auto-notifies patient."
    )
    @PutMapping("/{id}/status")
    public ResponseEntity<AppointmentResponseDTO>
    updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                appointmentService.updateStatus(id, status)
        );
    }

    @Operation(
            summary = "Get all appointments (Admin)",
            description = "Returns all appointments " +
                    "in the system. Newest first."
    )
    @GetMapping("/all")
    public ResponseEntity<List<AppointmentResponseDTO>>
    getAllAppointments() {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }
}