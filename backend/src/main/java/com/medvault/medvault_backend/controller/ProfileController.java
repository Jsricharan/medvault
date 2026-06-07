package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.dto.ProfileUpdateDTO;
import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
@SecurityRequirement(name = "Bearer Authentication")
@Tag(
        name = "Profile",
        description = "APIs for managing user profile, " +
                "password and hospital information"
)
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get profile
    @GetMapping
    @Operation(
            summary = "Get current user profile",
            description = "Returns complete profile of " +
                    "logged in user"
    )
    public ResponseEntity<Map<String, Object>> getProfile(
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("fullName", user.getFullName());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());
        profile.put("role", user.getRole());
        profile.put("specialization",
                user.getSpecialization());
        profile.put("profilePicture",
                user.getProfilePicture());
        profile.put("gender", user.getGender());
        profile.put("age", user.getAge());
        profile.put("bloodGroup", user.getBloodGroup());
        profile.put("hospitalName",
                user.getHospitalName());
        profile.put("hospitalAddress",
                user.getHospitalAddress());
        profile.put("hospitalCity",
                user.getHospitalCity());
        profile.put("experience", user.getExperience());
        profile.put("createdAt", user.getCreatedAt());

        // Use 'available' for doctor availability
        profile.put("enabled", user.isEnabled());
        profile.put("available", user.isAvailable());

        return ResponseEntity.ok(profile);
    }

    // Update phone
    @PutMapping("/phone")
    @Operation(
            summary = "Update phone number",
            description = "Updates phone number for " +
                    "logged in user"
    )
    public ResponseEntity<Map<String, String>> updatePhone(
            @RequestBody ProfileUpdateDTO request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        user.setPhone(request.getPhone());
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Phone updated successfully!");
        response.put("phone", user.getPhone());
        return ResponseEntity.ok(response);
    }

    // Update password
    @PutMapping("/password")
    @Operation(
            summary = "Update password",
            description = "Updates password. Requires " +
                    "current password for verification."
    )
    public ResponseEntity<Map<String, String>>
    updatePassword(
            @RequestBody ProfileUpdateDTO request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {
            throw new RuntimeException(
                    "Current password is incorrect!");
        }

        user.setPassword(passwordEncoder.encode(
                request.getNewPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Password updated successfully!");
        return ResponseEntity.ok(response);
    }

    // Update profile picture
    @Operation(
            summary = "Update profile picture",
            description = "Updates profile picture as " +
                    "base64 encoded image string"
    )
    @PutMapping("/picture")
    public ResponseEntity<Map<String, String>>
    updateProfilePicture(
            @RequestBody ProfileUpdateDTO request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        user.setProfilePicture(request.getProfilePicture());
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Profile picture updated successfully!");
        return ResponseEntity.ok(response);
    }

    // Update hospital info (for doctors)
    @Operation(
            summary = "Update hospital information",
            description = "Doctor updates their hospital " +
                    "name, address and experience"
    )
    @PutMapping("/hospital")
    public ResponseEntity<Map<String, String>>
    updateHospital(
            @RequestBody Map<String, String> request,
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        user.setHospitalName(request.get("hospitalName"));
        user.setHospitalAddress(
                request.get("hospitalAddress"));
        user.setHospitalCity(request.get("hospitalCity"));
        user.setExperience(request.get("experience"));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message",
                "Hospital info updated successfully!");
        return ResponseEntity.ok(response);
    }
    // Toggle doctor availability
    // Uses 'available' field NOT 'enabled'
    @Operation(
            summary = "Toggle doctor availability",
            description = "Doctor toggles their " +
                    "availability for appointments"
    )
    @PutMapping("/availability")
    public ResponseEntity<Map<String, Object>>
    toggleAvailability(
            Authentication authentication) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        // Toggle AVAILABILITY not ENABLED
        user.setAvailable(!user.isAvailable());
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("available", user.isAvailable());
        response.put("message", user.isAvailable()
                ? "You are now Available for appointments!"
                : "You are now Unavailable for appointments!"
        );

        return ResponseEntity.ok(response);
    }
}