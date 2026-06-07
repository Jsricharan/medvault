package com.medvault.medvault_backend.service;

import com.medvault.medvault_backend.dto.MedicalRecordRequestDTO;
import com.medvault.medvault_backend.dto.MedicalRecordResponseDTO;
import com.medvault.medvault_backend.entity.MedicalRecord;
import com.medvault.medvault_backend.entity.Role;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.MedicalRecordRepository;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository
            medicalRecordRepository;

    @Autowired
    private UserRepository userRepository;

    // Doctor creates a medical record
    public MedicalRecordResponseDTO createRecord(
            String doctorEmail,
            MedicalRecordRequestDTO request) {

        // Find doctor
        User doctor = userRepository
                .findByEmail(doctorEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found!"
                        )
                );

        // Verify doctor role
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException(
                    "Only doctors can create " +
                            "medical records!"
            );
        }

        // Find patient
        if (request.getPatientId() == null) {
            throw new RuntimeException(
                    "Patient ID is required!"
            );
        }

        User patient = userRepository
                .findById(request.getPatientId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " +
                                        request.getPatientId()
                        )
                );

        // Verify patient role
        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException(
                    "Medical records can only be " +
                            "created for patients!"
            );
        }

        // Validate diagnosis
        if (request.getDiagnosis() == null ||
                request.getDiagnosis().trim().isEmpty()) {
            throw new RuntimeException(
                    "Diagnosis is required!"
            );
        }

        // Create record
        MedicalRecord record = new MedicalRecord();
        record.setDoctor(doctor);
        record.setPatient(patient);
        record.setDiagnosis(
                request.getDiagnosis().trim()
        );

        // Optional fields - set safely
        if (request.getPrescription() != null) {
            record.setPrescription(
                    request.getPrescription()
            );
        }

        if (request.getMedicineSchedule() != null) {
            record.setMedicineSchedule(
                    request.getMedicineSchedule()
            );
        }

        if (request.getNotes() != null) {
            record.setNotes(request.getNotes());
        }

        if (request.getLabResults() != null) {
            record.setLabResults(
                    request.getLabResults()
            );
        }

        // Save
        MedicalRecord saved =
                medicalRecordRepository.save(record);

        return mapToResponseDTO(saved);
    }

    // Patient views their records
    public List<MedicalRecordResponseDTO>
    getMyRecords(String patientEmail) {

        User patient = userRepository
                .findByEmail(patientEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found!"
                        )
                );

        return medicalRecordRepository
                .findByPatient(patient)
                .stream()
                .sorted((a, b) ->
                        b.getId().compareTo(a.getId())
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Doctor views patient records
    public List<MedicalRecordResponseDTO>
    getPatientRecords(Long patientId) {

        User patient = userRepository
                .findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found!"
                        )
                );

        return medicalRecordRepository
                .findByPatient(patient)
                .stream()
                .sorted((a, b) ->
                        b.getId().compareTo(a.getId())
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Admin views all records
    public List<MedicalRecordResponseDTO>
    getAllRecords() {

        return medicalRecordRepository.findAll()
                .stream()
                .sorted((a, b) ->
                        b.getId().compareTo(a.getId())
                )
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Update record
    public MedicalRecordResponseDTO updateRecord(
            Long recordId,
            MedicalRecordRequestDTO request) {

        MedicalRecord record =
                medicalRecordRepository
                        .findById(recordId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical record not found!"
                                )
                        );

        if (request.getDiagnosis() != null) {
            record.setDiagnosis(request.getDiagnosis());
        }
        if (request.getPrescription() != null) {
            record.setPrescription(
                    request.getPrescription()
            );
        }
        if (request.getMedicineSchedule() != null) {
            record.setMedicineSchedule(
                    request.getMedicineSchedule()
            );
        }
        if (request.getNotes() != null) {
            record.setNotes(request.getNotes());
        }
        if (request.getLabResults() != null) {
            record.setLabResults(request.getLabResults());
        }

        MedicalRecord updated =
                medicalRecordRepository.save(record);
        return mapToResponseDTO(updated);
    }

    // Delete record
    public String deleteRecord(Long recordId) {
        MedicalRecord record =
                medicalRecordRepository
                        .findById(recordId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Medical record not found!"
                                )
                        );
        medicalRecordRepository.delete(record);
        return "Medical record deleted successfully!";
    }

    // Map to DTO
    private MedicalRecordResponseDTO mapToResponseDTO(
            MedicalRecord record) {

        MedicalRecordResponseDTO dto =
                new MedicalRecordResponseDTO();
        dto.setId(record.getId());
        dto.setPatientName(
                record.getPatient().getFullName()
        );
        dto.setPatientEmail(
                record.getPatient().getEmail()
        );
        dto.setDoctorName(
                record.getDoctor().getFullName()
        );
        dto.setDoctorEmail(
                record.getDoctor().getEmail()
        );
        dto.setDiagnosis(record.getDiagnosis());
        dto.setPrescription(record.getPrescription());
        dto.setMedicineSchedule(
                record.getMedicineSchedule()
        );
        dto.setNotes(record.getNotes());
        dto.setLabResults(record.getLabResults());
        dto.setCreatedAt(record.getCreatedAt());
        dto.setUpdatedAt(record.getUpdatedAt());
        return dto;
    }
}