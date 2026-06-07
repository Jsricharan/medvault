package com.medvault.medvault_backend.repository;

import com.medvault.medvault_backend.entity.MedicalRecord;
import com.medvault.medvault_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRecordRepository
        extends JpaRepository<MedicalRecord, Long> {

    // Get all records for a specific patient
    List<MedicalRecord> findByPatient(User patient);

    // Get all records created by a specific doctor
    List<MedicalRecord> findByDoctor(User doctor);
}