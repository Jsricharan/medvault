package com.medvault.medvault_backend.repository;

import com.medvault.medvault_backend.entity.DoctorLeave;
import com.medvault.medvault_backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository

public interface DoctorLeaveRepository
        extends JpaRepository<DoctorLeave, Long> {

    List<DoctorLeave> findByDoctor(User doctor);

    boolean existsByDoctorAndLeaveDate(
            User doctor, LocalDate leaveDate
    );

    List<DoctorLeave> findByLeaveDate(LocalDate leaveDate);

    List<DoctorLeave> findByDoctorAndLeaveDateGreaterThanEqual(
            User doctor, LocalDate date
    );
}