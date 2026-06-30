package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.entity.DoctorLeave;
import com.medvault.medvault_backend.service.DoctorLeaveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(
        name = "Doctor Leaves",
        description = "APIs for managing doctor " +
                "leave dates and availability"
)
public class DoctorLeaveController {

    @Autowired
    private DoctorLeaveService doctorLeaveService;
    @Operation(
            summary = "Add a leave date",
            description = "Doctor marks a specific " +
                    "date as leave. Patients cannot " +
                    "book on this date."
    )
    @PostMapping("/add")
    public ResponseEntity<DoctorLeave> addLeave(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        String doctorEmail = authentication.getName();

        LocalDate leaveDate = LocalDate.parse(
                request.get("leaveDate")
        );

        String reason = request.get("reason");

        DoctorLeave saved = doctorLeaveService
                .addLeave(
                        doctorEmail,
                        leaveDate,
                        reason
                );

        return ResponseEntity.ok(saved);
    }
    @Operation(
            summary = "Get my leaves",
            description = "Returns all upcoming " +
                    "leave dates for the logged " +
                    "in doctor. Past leaves are " +
                    "excluded."
    )
    @GetMapping("/my")
    public ResponseEntity<List<DoctorLeave>> getMyLeaves(
            Authentication authentication) {
        String doctorEmail = authentication.getName();
        List<DoctorLeave> leaves = doctorLeaveService
                .getMyLeaves(doctorEmail);

        return ResponseEntity.ok(leaves);
    }

    @Operation(
            summary = "Cancel a leave date",
            description = "Doctor removes a leave " +
                    "date. Only the doctor who " +
                    "created the leave can cancel it. " +
                    "Past leaves cannot be cancelled."
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<String> cancelLeave(
            @PathVariable Long id,
            Authentication authentication) {

        String doctorEmail = authentication.getName();
        String message = doctorLeaveService
                .cancelLeave(id, doctorEmail);

        return ResponseEntity.ok(message);
    }

    @Operation(
            summary = "Get leaves for a doctor",
            description = "Returns all upcoming " +
                    "leave dates for a specific " +
                    "doctor. Used by patient when " +
                    "booking to check availability."
    )
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<DoctorLeave>> getDoctorLeaves(
            @PathVariable Long doctorId) {
        List<DoctorLeave> leaves = doctorLeaveService
                .getDoctorLeaves(doctorId);

        return ResponseEntity.ok(leaves);
    }

    @Operation(
            summary = "Check if doctor is on leave",
            description = "Quick boolean check. " +
                    "Returns true if doctor has " +
                    "leave on given date. " +
                    "Used before booking confirmation."
    )
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkLeave(
            @RequestParam Long doctorId,
            @RequestParam String date) {

        LocalDate leaveDate = LocalDate.parse(date);

        List<DoctorLeave> leaves = doctorLeaveService
                .getDoctorLeaves(doctorId);
        boolean onLeave = leaves.stream()
                .anyMatch(leave ->
                        leave.getLeaveDate()
                                .equals(leaveDate)
                );

        return ResponseEntity.ok(
                Map.of("onLeave", onLeave)
        );
    }
}