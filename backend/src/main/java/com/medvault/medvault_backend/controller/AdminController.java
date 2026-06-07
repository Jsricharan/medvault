package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.dto.AppointmentResponseDTO;
import com.medvault.medvault_backend.dto.UserUpdateDTO;
import com.medvault.medvault_backend.entity.Appointment;
import com.medvault.medvault_backend.entity.Role;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.AppointmentRepository;
import com.medvault.medvault_backend.repository.UserRepository;
import com.medvault.medvault_backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(
        name = "Admin",
        description = "Admin only APIs for managing " +
                "users, appointments and system"
)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private org.springframework.security.crypto
            .password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.medvault.medvault_backend.repository
            .NotificationRepository notificationRepository;

    // Get all users
    @Operation(
            summary = "Get all users",
            description = "Returns all users in system"
    )
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // Get all doctors - with no cache
    @Operation(
            summary = "Get all doctors",
            description = "Returns all doctors with " +
                    "availability status"
    )
    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok()
                .header("Cache-Control",
                        "no-cache, no-store, must-revalidate")
                .header("Pragma", "no-cache")
                .body(userRepository.findByRole(Role.DOCTOR));
    }

    // Get all patients
    @Operation(
            summary = "Get all patients",
            description = "Returns all patients"
    )
    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(
                userRepository.findByRole(Role.PATIENT)
        );
    }

    // Get dashboard stats
    @Operation(
            summary = "Get dashboard statistics",
            description = "Returns counts of users, " +
                    "appointments etc."
    )
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",
                userRepository.findAll().size());
        stats.put("totalDoctors",
                userRepository.findByRole(Role.DOCTOR).size());
        stats.put("totalPatients",
                userRepository.findByRole(Role.PATIENT).size());
        stats.put("totalAppointments",
                appointmentRepository.findAll().size());
        stats.put("pendingAppointments",
                appointmentRepository
                        .findByStatus("PENDING").size());
        stats.put("unassignedAppointments",
                appointmentRepository
                        .findByStatus("UNASSIGNED").size());
        return ResponseEntity.ok(stats);
    }

    // Get user by ID
    @Operation(
            summary = "Update user details",
            description = "Admin updates any user's " +
                    "profile including hospital info"
    )
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));
        return ResponseEntity.ok(user);
    }

    // Update user details - Full edit
    @Operation(
            summary = "Update user details",
            description = "Admin updates any user's " +
                    "profile including hospital info"
    )
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateDTO request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getPhone() != null)
            user.setPhone(request.getPhone());
        if (request.getSpecialization() != null)
            user.setSpecialization(
                    request.getSpecialization());
        if (request.getEnabled() != null)
            user.setEnabled(request.getEnabled());
        if (request.getGender() != null)
            user.setGender(request.getGender());
        if (request.getAge() != null)
            user.setAge(request.getAge());
        if (request.getBloodGroup() != null)
            user.setBloodGroup(request.getBloodGroup());
        if (request.getHospitalName() != null)
            user.setHospitalName(request.getHospitalName());
        if (request.getHospitalAddress() != null)
            user.setHospitalAddress(
                    request.getHospitalAddress());
        if (request.getHospitalCity() != null)
            user.setHospitalCity(request.getHospitalCity());
        if (request.getExperience() != null)
            user.setExperience(request.getExperience());

        User updated = userRepository.save(user);
        return ResponseEntity.ok(updated);
    }

    // Toggle user status
    @Operation(
            summary = "Toggle user active/inactive",
            description = "Admin activates or deactivates " +
                    "a user account"
    )
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<String> toggleUserStatus(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);

        String status = user.isEnabled()
                ? "activated" : "deactivated";
        return ResponseEntity.ok(
                "User " + status + " successfully!"
        );
    }
    // Reset user password - Admin only
    @Operation(
            summary = "Reset user password",
            description = "Admin resets password for " +
                    "any user account"
    )
    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<Map<String, String>>
    resetUserPassword(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        String newPassword = request.get("newPassword");
        if (newPassword == null ||
                newPassword.length() < 6) {
            throw new RuntimeException(
                    "Password must be at least 6 characters!");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Password reset successfully!");
        return ResponseEntity.ok(response);
    }
    // Get all appointments
    @Operation(
            summary = "Get all appointments",
            description = "Returns all appointments. " +
                    "Newest first."
    )
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponseDTO>>
    getAllAppointments() {
        return ResponseEntity.ok(
                appointmentService.getAllAppointments()
        );
    }

    // Get unassigned appointments
    @Operation(
            summary = "Get unassigned appointments",
            description = "Returns appointments with " +
                    "no doctor assigned yet"
    )
    @GetMapping("/appointments/unassigned")
    public ResponseEntity<List<AppointmentResponseDTO>>
    getUnassignedAppointments() {
        return ResponseEntity.ok(
                appointmentService.getUnassignedAppointments()
        );
    }

    // Update appointment status
    @Operation(
            summary = "Update appointment status",
            description = "Admin confirms or cancels " +
                    "any appointment"
    )
    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentResponseDTO>
    updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        // This calls AppointmentService which
        // already sends notifications!
        return ResponseEntity.ok(
                appointmentService.updateStatus(id, status)
        );
    }

    // Assign doctor to appointment
    @Operation(
            summary = "Assign doctor to appointment",
            description = "Admin assigns a doctor and " +
                    "notifies both doctor and patient"
    )
    @PutMapping("/appointments/{id}/assign-doctor")
    public ResponseEntity<String> assignDoctor(
            @PathVariable Long id,
            @RequestParam Long doctorId) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found!"
                                )
                        );

        User doctor = userRepository
                .findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found!"
                        )
                );

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException(
                    "Selected user is not a doctor!"
            );
        }

        appointment.setDoctor(doctor);
        appointment.setStatus("PENDING");
        appointmentRepository.save(appointment);

        // Notify DOCTOR
        try {
            com.medvault.medvault_backend.entity
                    .Notification doctorNotif =
                    new com.medvault.medvault_backend
                            .entity.Notification();
            doctorNotif.setUser(doctor);
            doctorNotif.setMessage(
                    "📅 You have been assigned a new " +
                            "appointment by Admin!\n" +
                            "Patient: " +
                            appointment.getPatient().getFullName() +
                            "\nDate: " +
                            appointment.getAppointmentDate() +
                            " at " +
                            appointment.getAppointmentTime() +
                            "\nProblem: " +
                            appointment.getNotes()
            );
            doctorNotif.setRead(false);
            notificationRepository.save(doctorNotif);
        } catch (Exception e) {
            System.out.println(
                    "Doctor notification error: " +
                            e.getMessage()
            );
        }

        // Notify PATIENT
        try {
            com.medvault.medvault_backend.entity
                    .Notification patientNotif =
                    new com.medvault.medvault_backend
                            .entity.Notification();
            patientNotif.setUser(
                    appointment.getPatient()
            );
            patientNotif.setMessage(
                    "✅ Good news! A doctor has been " +
                            "assigned to your appointment.\n" +
                            "Doctor: Dr. " +
                            doctor.getFullName() +
                            (doctor.getSpecialization() != null
                                    ? " (" +
                                    doctor.getSpecialization() + ")"
                                    : "") +
                            "\nDate: " +
                            appointment.getAppointmentDate() +
                            " at " +
                            appointment.getAppointmentTime() +
                            "\nYour appointment status is now PENDING."
            );
            patientNotif.setRead(false);
            notificationRepository.save(patientNotif);
        } catch (Exception e) {
            System.out.println(
                    "Patient notification error: " +
                            e.getMessage()
            );
        }

        return ResponseEntity.ok(
                "Doctor assigned and notifications sent!"
        );
    }
}