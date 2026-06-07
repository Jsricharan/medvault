package com.medvault.medvault_backend.repository;

import com.medvault.medvault_backend.entity.Appointment;
import com.medvault.medvault_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Find all appointments for a specific patient
    List<Appointment> findByPatient(User patient);

    // Find all appointments for a specific doctor
    List<Appointment> findByDoctor(User doctor);

    // Find appointments by status
    List<Appointment> findByStatus(String status);
}