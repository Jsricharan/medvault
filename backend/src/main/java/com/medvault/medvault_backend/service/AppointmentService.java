package com.medvault.medvault_backend.service;

import com.medvault.medvault_backend.dto.AppointmentRequestDTO;
import com.medvault.medvault_backend.dto.AppointmentResponseDTO;
import com.medvault.medvault_backend.entity.Appointment;
import com.medvault.medvault_backend.entity.Role;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.AppointmentRepository;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private com.medvault.medvault_backend.repository.NotificationRepository notificationRepository;

    // Book a new appointment
    public AppointmentResponseDTO bookAppointment(
            String patientEmail,
            AppointmentRequestDTO request) {

        User patient = userRepository
                .findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found!"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setNotes(request.getNotes());

        if (request.getDoctorId() != null) {
            User doctor = userRepository
                    .findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Doctor not found!"));

            if (doctor.getRole() != Role.DOCTOR) {
                throw new RuntimeException("Selected user is not a doctor!");
            }

            // Check doctor availability
            // Use 'available' field NOT 'enabled'
            if (!doctor.isAvailable()) {
                throw new RuntimeException(
                        "This doctor is currently unavailable " +
                                "for appointments. Please select " +
                                "another doctor."
                );
            }

            // --- CHECK DOCTOR APPOINTMENT CONFLICT (INTEGRATED) ---
            boolean hasConflict = appointmentRepository
                    .findByDoctor(doctor)
                    .stream()
                    .anyMatch(existing ->
                            existing.getAppointmentDate().equals(request.getAppointmentDate()) &&
                                    existing.getAppointmentTime().equals(request.getAppointmentTime()) &&
                                    !existing.getStatus().equalsIgnoreCase("CANCELLED")
                    );

            if (hasConflict) {
                throw new RuntimeException(
                        "This doctor already has an appointment " +
                                "at " + request.getAppointmentDate() +
                                " " + request.getAppointmentTime() +
                                ". Please choose a different time."
                );
            }
            // ------------------------------------------------------

            appointment.setDoctor(doctor);
            appointment.setStatus("PENDING");
        } else {
            appointment.setDoctor(null);
            appointment.setStatus("UNASSIGNED");
        }

        // Save appointment
        Appointment saved =
                appointmentRepository.save(appointment);

            // Notify doctor if assigned
        if (saved.getDoctor() != null) {
            try {
                com.medvault.medvault_backend.entity
                        .Notification doctorNotification =
                        new com.medvault.medvault_backend
                                .entity.Notification();
                doctorNotification.setUser(
                        saved.getDoctor()
                );
                doctorNotification.setMessage(
                        "📅 New appointment request from " +
                                saved.getPatient().getFullName() +
                                " on " + saved.getAppointmentDate() +
                                " at " + saved.getAppointmentTime() +
                                ". Problem: " + saved.getNotes()
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

// Notify admin if unassigned
        if (saved.getDoctor() == null) {
            try {
                // Find all admins
                userRepository.findAll()
                        .stream()
                        .filter(u -> u.getRole() ==
                                com.medvault.medvault_backend
                                        .entity.Role.ADMIN)
                        .forEach(admin -> {
                            com.medvault.medvault_backend
                                    .entity.Notification
                                    adminNotification =
                                    new com.medvault.medvault_backend
                                            .entity.Notification();
                            adminNotification.setUser(admin);
                            adminNotification.setMessage(
                                    "⚠️ New unassigned appointment " +
                                            "request from " +
                                            saved.getPatient().getFullName() +
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

    // Get appointments for patient - Newest first
    public List<AppointmentResponseDTO> getMyAppointments(String patientEmail) {
        Optional<User> patientOpt = userRepository.findByEmail(patientEmail);

        if (patientOpt.isEmpty()) {
            return new ArrayList<>();
        }

        return appointmentRepository
                .findByPatient(patientOpt.get())
                .stream()
                .sorted(Comparator.comparingLong(Appointment::getId).reversed())
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get appointments for doctor - Newest first
    public List<AppointmentResponseDTO> getDoctorAppointments(String doctorEmail) {
        Optional<User> doctorOpt = userRepository.findByEmail(doctorEmail);

        if (doctorOpt.isEmpty()) {
            return new ArrayList<>();
        }

        return appointmentRepository
                .findByDoctor(doctorOpt.get())
                .stream()
                .sorted(Comparator.comparingLong(Appointment::getId).reversed())
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Update appointment status
    public AppointmentResponseDTO updateStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found!"));

        appointment.setStatus(status.toUpperCase());
        Appointment updated = appointmentRepository.save(appointment);

        // Auto notify patient
        try {
            String message = buildNotificationMessage(updated, status);
            com.medvault.medvault_backend.entity.Notification notification =
                    new com.medvault.medvault_backend.entity.Notification();
            notification.setUser(updated.getPatient());
            notification.setMessage(message);
            notification.setRead(false);
            notificationRepository.save(notification);
        } catch (Exception e) {
            System.out.println("Notification error: " + e.getMessage());
        }

        return mapToResponseDTO(updated);
    }

    private String buildNotificationMessage(Appointment apt, String status) {
        String doctorName = apt.getDoctor() != null
                ? "Dr. " + apt.getDoctor().getFullName()
                : "your assigned doctor";

        switch (status.toUpperCase()) {
            case "CONFIRMED":
                return "✅ Your appointment with " + doctorName + " on " +
                        apt.getAppointmentDate() + " at " + apt.getAppointmentTime() +
                        " has been CONFIRMED!";
            case "CANCELLED":
                return "❌ Your appointment with " + doctorName + " on " +
                        apt.getAppointmentDate() + " has been CANCELLED. " +
                        "Please book a new appointment.";
            case "COMPLETED":
                return "✔️ Your appointment with " + doctorName + " has been marked as COMPLETED. Thank you!";
            case "PENDING":
                return "⏳ Your appointment with " + doctorName + " on " +
                        apt.getAppointmentDate() + " is PENDING confirmation.";
            default:
                return "Your appointment status has been updated to: " + status;
        }
    }

    // Get all appointments - Admin - Newest first
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .sorted(Comparator.comparingLong(Appointment::getId).reversed())
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get unassigned appointments - Newest first
    public List<AppointmentResponseDTO> getUnassignedAppointments() {
        return appointmentRepository
                .findByStatus("UNASSIGNED")
                .stream()
                .sorted(Comparator.comparingLong(Appointment::getId).reversed())
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper - map to DTO
    private AppointmentResponseDTO mapToResponseDTO(Appointment appointment) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(appointment.getId());

        // Patient info
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientName(appointment.getPatient().getFullName());
        dto.setPatientEmail(appointment.getPatient().getEmail());

        // Doctor info - handle null
        if (appointment.getDoctor() != null) {
            dto.setDoctorId(appointment.getDoctor().getId());
            dto.setDoctorName(appointment.getDoctor().getFullName());
            dto.setDoctorEmail(appointment.getDoctor().getEmail());
            dto.setDoctorAssigned(true);
        } else {
            dto.setDoctorId(null);
            dto.setDoctorName("Not Assigned Yet");
            dto.setDoctorEmail("");
            dto.setDoctorAssigned(false);
        }

        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentTime(appointment.getAppointmentTime());
        dto.setStatus(appointment.getStatus());
        dto.setNotes(appointment.getNotes());
        dto.setCreatedAt(appointment.getCreatedAt());
        return dto;
    }
}