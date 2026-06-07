package com.medvault.medvault_backend.service;

import com.medvault.medvault_backend.dto.AuthResponse;
import com.medvault.medvault_backend.dto.LoginRequest;
import com.medvault.medvault_backend.dto.RegisterRequest;
import com.medvault.medvault_backend.entity.Role;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.UserRepository;
import com.medvault.medvault_backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(
            RegisterRequest request) {

        // Validate email not taken
        if (userRepository.existsByEmail(
                request.getEmail().trim()
                        .toLowerCase())) {
            throw new RuntimeException(
                    "EMAIL_ALREADY_EXISTS: " +
                            "This email is already registered!"
            );
        }

        // Build user object
        User user = new User();
        user.setFullName(
                request.getFullName().trim()
        );
        user.setEmail(
                request.getEmail().trim().toLowerCase()
        );
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );
        user.setPhone(request.getPhone());

        // Role
        try {
            user.setRole(
                    Role.valueOf(
                            request.getRole()
                                    .toUpperCase().trim()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException(
                    "Invalid role! Must be PATIENT, " +
                            "DOCTOR, or ADMIN"
            );
        }

        // Always active and available by default
        user.setEnabled(true);
        user.setAvailable(true);

        // Optional fields - set safely
        if (request.getGender() != null &&
                !request.getGender().isEmpty()) {
            user.setGender(request.getGender());
        }

        if (request.getSpecialization() != null &&
                !request.getSpecialization().isEmpty()) {
            user.setSpecialization(
                    request.getSpecialization()
            );
        }

        if (request.getAge() != null &&
                request.getAge() > 0) {
            user.setAge(request.getAge());
        }

        // Blood group - keep short
        String bg = request.getBloodGroup();
        if (bg != null && !bg.isEmpty()) {
            // Remove any long text
            if (bg.length() > 15 ||
                    bg.contains("Not") ||
                    bg.contains("—")) {
                user.setBloodGroup("NA");
            } else {
                user.setBloodGroup(bg);
            }
        } else {
            user.setBloodGroup("NA");
        }

        // Save
        userRepository.save(user);

        // Generate token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getFullName(),
                user.getEmail(),
                "Registration successful!"
        );
    }

    public AuthResponse login(
            LoginRequest request) {

        // Find user
        User user = userRepository
                .findByEmail(
                        request.getEmail().trim()
                                .toLowerCase()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password!"
                        )
                );

        // Check account active
        if (!user.isEnabled()) {
            throw new RuntimeException(
                    "Your account has been deactivated. " +
                            "Please contact admin."
            );
        }

        // Check password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException(
                    "Invalid email or password!"
            );
        }

        // Generate token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getFullName(),
                user.getEmail(),
                "Login successful!"
        );
    }
}