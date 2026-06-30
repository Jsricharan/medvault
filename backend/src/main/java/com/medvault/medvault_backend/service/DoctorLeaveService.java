package com.medvault.medvault_backend.service;

import com.medvault.medvault_backend.entity.DoctorLeave;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.DoctorLeaveRepository;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DoctorLeaveService {

    @Autowired
    private DoctorLeaveRepository doctorLeaveRepository;

    @Autowired
    private UserRepository userRepository;
    public DoctorLeave addLeave(
            String doctorEmail,
            LocalDate leaveDate,
            String reason) {

        User doctor = userRepository
                .findByEmail(doctorEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found!"
                        )
                );

        boolean alreadyExists =
                doctorLeaveRepository
                        .existsByDoctorAndLeaveDate(
                                doctor, leaveDate
                        );

        if (alreadyExists) {
            throw new RuntimeException(
                    "You already have a leave on "
                            + leaveDate
                            + "! Cannot add duplicate."
            );
        }

        if (leaveDate.isBefore(LocalDate.now())) {
            throw new RuntimeException(
                    "Cannot add leave for past dates! "
                            + "Please select today or a future date."
            );
        }

        DoctorLeave leave = new DoctorLeave();

        leave.setDoctor(doctor);
        leave.setLeaveDate(leaveDate);
        leave.setReason(reason);

        return doctorLeaveRepository.save(leave);
    }

    public List<DoctorLeave> getMyLeaves(
            String doctorEmail) {

        User doctor = userRepository
                .findByEmail(doctorEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found!"
                        )
                );

        return doctorLeaveRepository
                .findByDoctorAndLeaveDateGreaterThanEqual(
                        doctor,
                        LocalDate.now()
                );
    }

    public String cancelLeave(
            Long leaveId,
            String doctorEmail) {

        DoctorLeave leave = doctorLeaveRepository
                .findById(leaveId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Leave not found!"
                        )
                );

        User doctor = userRepository
                .findByEmail(doctorEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found!"
                        )
                );

        if (!leave.getDoctor()
                .getId()
                .equals(doctor.getId())) {
            throw new RuntimeException(
                    "Not authorized! "
                            + "You can only cancel your own leaves."
            );
        }

        if (leave.getLeaveDate()
                .isBefore(LocalDate.now())) {
            throw new RuntimeException(
                    "Cannot cancel past leaves! "
                            + "This leave date has already passed."
            );
        }

        doctorLeaveRepository.deleteById(leaveId);

        return "Leave on "
                + leave.getLeaveDate()
                + " cancelled successfully!";
    }


    public List<DoctorLeave> getDoctorLeaves(
            Long doctorId) {

        User doctor = userRepository
                .findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found "
                                        + "with ID: "
                                        + doctorId
                        )
                );

        return doctorLeaveRepository
                .findByDoctorAndLeaveDateGreaterThanEqual(
                        doctor,
                        LocalDate.now()
                );
    }

    public boolean isOnLeave(
            User doctor,
            LocalDate date) {


        return doctorLeaveRepository
                .existsByDoctorAndLeaveDate(
                        doctor, date
                );
    }
}