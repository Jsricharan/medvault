package com.medvault.medvault_backend.service;

import com.medvault.medvault_backend.dto.AppointmentRequestDTO;
import com.medvault.medvault_backend.dto.AppointmentResponseDTO;
import com.medvault.medvault_backend.entity.Appointment;
import com.medvault.medvault_backend.entity.Notification;
import com.medvault.medvault_backend.entity.Role;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.AppointmentRepository;
import com.medvault.medvault_backend.repository.NotificationRepository;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorLeaveService doctorLeaveService;

    @Autowired
    private NotificationRepository notificationRepository;

    // ─────────────────────────────────────────────
    // Book a new appointment
    // ─────────────────────────────────────────────
    public AppointmentResponseDTO bookAppointment(
            String patientEmail,
            AppointmentRequestDTO request) {

        // Find patient by email
        User patient = userRepository
                .findByEmail(patientEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found!"
                        )
                );

        // Create appointment object
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentDate(
                request.getAppointmentDate()
        );
        appointment.setAppointmentTime(
                request.getAppointmentTime()
        );
        appointment.setNotes(request.getNotes());

        // Check if doctor was selected
        if (request.getDoctorId() != null) {

            // Find doctor by ID
            User doctor = userRepository
                    .findById(request.getDoctorId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Doctor not found!"
                            )
                    );

            // Check selected user is actually a doctor
            if (doctor.getRole() != Role.DOCTOR) {
                throw new RuntimeException(
                        "Selected user is not a doctor!"
                );
            }

            // Check 1 — Doctor availability toggle
            // Uses 'available' field NOT 'enabled'
            if (!doctor.isAvailable()) {
                throw new RuntimeException(
                        "This doctor is currently " +
                                "unavailable for appointments. " +
                                "Please select another doctor."
                );
            }

            // Check 2 — Doctor leave check
            LocalDate appointmentDate =
                    request.getAppointmentDate();

            // Now check leave
            if (doctorLeaveService.isOnLeave(
                    doctor, appointmentDate)) {
                throw new RuntimeException(
                        "Doctor is on leave on " +
                                appointmentDate +
                                ". Please select a different date."
                );
            }

            // Check 3 — Appointment conflict check
            // Same doctor cannot have two appointments
            // at same date and same time
            boolean hasConflict = appointmentRepository
                    .findByDoctor(doctor)
                    .stream()
                    .anyMatch(existing ->
                            existing.getAppointmentDate()
                                    .equals(request.getAppointmentDate()) &&
                                    existing.getAppointmentTime()
                                            .equals(request.getAppointmentTime()) &&
                                    !existing.getStatus()
                                            .equalsIgnoreCase("CANCELLED")
                    );

            if (hasConflict) {
                throw new RuntimeException(
                        "This doctor already has an appointment " +
                                "at " + request.getAppointmentDate() +
                                " " + request.getAppointmentTime() +
                                ". Please choose a different time."
                );
            }

            // All checks passed — assign doctor
            appointment.setDoctor(doctor);
            appointment.setStatus("PENDING");

        } else {
            // No doctor selected
            // Admin will assign later
            appointment.setDoctor(null);
            appointment.setStatus("UNASSIGNED");
        }

        // Save appointment to database
        Appointment saved =
                appointmentRepository.save(appointment);

        // Notify DOCTOR if assigned
        if (saved.getDoctor() != null) {
            try {
                Notification doctorNotification =
                        new Notification();
                doctorNotification.setUser(
                        saved.getDoctor()
                );
                doctorNotification.setMessage(
                        "New appointment request from " +
                                saved.getPatient().getFullName() +
                                " on " +
                                saved.getAppointmentDate() +
                                " at " +
                                saved.getAppointmentTime() +
                                ". Problem: " +
                                saved.getNotes()
                );
                doctorNotification.setRead(false);
                notificationRepository.save(
                        doctorNotification
                );
            } catch (Exception e) {
                System.out.println(
                        "Doctor notification error: " +
                                e.getMessage()
                );
            }
        }

        // Notify ALL ADMINS if no doctor assigned
        if (saved.getDoctor() == null) {
            try {
                userRepository.findAll()
                        .stream()
                        .filter(u ->
                                u.getRole() == Role.ADMIN
                        )
                        .forEach(admin -> {
                            Notification adminNotification =
                                    new Notification();
                            adminNotification.setUser(admin);
                            adminNotification.setMessage(
                                    "New unassigned appointment " +
                                            "request from " +
                                            saved.getPatient()
                                                    .getFullName() +
                                            " on " +
                                            saved.getAppointmentDate() +
                                            ". Please assign a doctor."
                            );
                            adminNotification.setRead(false);
                            notificationRepository.save(
                                    adminNotification
                            );
                        });
            } catch (Exception e) {
                System.out.println(
                        "Admin notification error: " +
                                e.getMessage()
                );
            }
        }

        return mapToResponseDTO(saved);
    }

    // ─────────────────────────────────────────────
    // Get appointments for patient
    // Newest first by ID descending
    // ─────────────────────────────────────────────
    public List<AppointmentResponseDTO> getMyAppointments(
            String patientEmail) {

        Optional<User> patientOpt =
                userRepository.findByEmail(patientEmail);

        if (patientOpt.isEmpty()) {
            return new ArrayList<>();
        }

        return appointmentRepository
                .findByPatient(patientOpt.get())
                .stream()
                .sorted(Comparator
                        .comparingLong(Appointment::getId)
                        .reversed()
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    // Get appointments for doctor
    // Newest first by ID descending
    // ─────────────────────────────────────────────
    public List<AppointmentResponseDTO> getDoctorAppointments(
            String doctorEmail) {

        Optional<User> doctorOpt =
                userRepository.findByEmail(doctorEmail);

        if (doctorOpt.isEmpty()) {
            return new ArrayList<>();
        }

        return appointmentRepository
                .findByDoctor(doctorOpt.get())
                .stream()
                .sorted(Comparator
                        .comparingLong(Appointment::getId)
                        .reversed()
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    // Update appointment status
    // Also auto-notifies patient
    // ─────────────────────────────────────────────
    public AppointmentResponseDTO updateStatus(
            Long appointmentId,
            String status) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Appointment not found!"
                        )
                );

        appointment.setStatus(status.toUpperCase());
        Appointment updated =
                appointmentRepository.save(appointment);

        // Auto notify patient on every status change
        try {
            String message = buildNotificationMessage(
                    updated, status
            );
            Notification notification = new Notification();
            notification.setUser(updated.getPatient());
            notification.setMessage(message);
            notification.setRead(false);
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.out.println(
                    "Notification error: " +
                            e.getMessage()
            );
        }

        return mapToResponseDTO(updated);
    }

    // ─────────────────────────────────────────────
    // Build notification message based on status
    // ─────────────────────────────────────────────
    private String buildNotificationMessage(
            Appointment apt,
            String status) {

        String doctorName = apt.getDoctor() != null
                ? "Dr. " + apt.getDoctor().getFullName()
                : "your assigned doctor";

        switch (status.toUpperCase()) {
            case "CONFIRMED":
                return "Your appointment with " +
                        doctorName + " on " +
                        apt.getAppointmentDate() +
                        " at " +
                        apt.getAppointmentTime() +
                        " has been CONFIRMED!";
            case "CANCELLED":
                return "Your appointment with " +
                        doctorName + " on " +
                        apt.getAppointmentDate() +
                        " has been CANCELLED. " +
                        "Please book a new appointment.";
            case "COMPLETED":
                return "Your appointment with " +
                        doctorName +
                        " has been marked as COMPLETED." +
                        " Thank you!";
            case "PENDING":
                return "Your appointment with " +
                        doctorName + " on " +
                        apt.getAppointmentDate() +
                        " is PENDING confirmation.";
            default:
                return "Your appointment status " +
                        "has been updated to: " + status;
        }
    }

    // ─────────────────────────────────────────────
    // Get all appointments - Admin
    // Newest first by ID descending
    // ─────────────────────────────────────────────
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .sorted(Comparator
                        .comparingLong(Appointment::getId)
                        .reversed()
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    // Get unassigned appointments only
    // Newest first
    // ─────────────────────────────────────────────
    public List<AppointmentResponseDTO> getUnassignedAppointments() {
        return appointmentRepository
                .findByStatus("UNASSIGNED")
                .stream()
                .sorted(Comparator
                        .comparingLong(Appointment::getId)
                        .reversed()
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────
    // Map Appointment entity to DTO
    // Never return entity directly from controller
    // ─────────────────────────────────────────────
    private AppointmentResponseDTO mapToResponseDTO(
            Appointment appointment) {

        AppointmentResponseDTO dto =
                new AppointmentResponseDTO();

        dto.setId(appointment.getId());

        // Patient info
        dto.setPatientId(
                appointment.getPatient().getId()
        );
        dto.setPatientName(
                appointment.getPatient().getFullName()
        );
        dto.setPatientEmail(
                appointment.getPatient().getEmail()
        );

        // Doctor info - doctor can be null
        if (appointment.getDoctor() != null) {
            dto.setDoctorId(
                    appointment.getDoctor().getId()
            );
            dto.setDoctorName(
                    appointment.getDoctor().getFullName()
            );
            dto.setDoctorEmail(
                    appointment.getDoctor().getEmail()
            );
            dto.setDoctorAssigned(true);
        } else {
            dto.setDoctorId(null);
            dto.setDoctorName("Not Assigned Yet");
            dto.setDoctorEmail("");
            dto.setDoctorAssigned(false);
        }

        dto.setAppointmentDate(
                appointment.getAppointmentDate()
        );
        dto.setAppointmentTime(
                appointment.getAppointmentTime()
        );
        dto.setStatus(appointment.getStatus());
        dto.setNotes(appointment.getNotes());
        dto.setCreatedAt(appointment.getCreatedAt());

        return dto;
    }
}