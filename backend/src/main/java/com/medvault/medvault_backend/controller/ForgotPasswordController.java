package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.entity.User;
import com.medvault.medvault_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Store OTPs temporarily in memory
    // Key: email, Value: OTP
    private final ConcurrentHashMap<String, String> otpStore =
            new ConcurrentHashMap<>();

    // Verify email or phone exists
    @PostMapping("/forgot-password/verify")
    public ResponseEntity<Map<String, String>> verifyUser(
            @RequestBody Map<String, String> request) {

        String identifier = request.get("identifier");
        Map<String, String> response = new HashMap<>();

        if (identifier == null || identifier.trim().isEmpty()) {
            response.put("message",
                    "Please provide email or phone number!");
            return ResponseEntity.badRequest().body(response);
        }

        // Check if email exists
        Optional<User> userByEmail =
                userRepository.findByEmail(identifier.trim());

        // Check if phone exists
        Optional<User> userByPhone =
                userRepository.findAll()
                        .stream()
                        .filter(u -> identifier.trim()
                                .equals(u.getPhone()))
                        .findFirst();

        User user = userByEmail.orElse(
                userByPhone.orElse(null)
        );

        if (user == null) {
            response.put("message",
                    "No account found with this " +
                            "email or phone number!");
            return ResponseEntity.badRequest().body(response);
        }

        // Generate 6 digit OTP
        String otp = String.format(
                "%06d", new Random().nextInt(999999)
        );

        // Store OTP with email as key
        otpStore.put(user.getEmail(), otp);

        // In real app - send OTP via email/SMS
        // For now we return it directly for testing
        System.out.println(
                "OTP for " + user.getEmail() + ": " + otp
        );

        response.put("message",
                "OTP sent successfully! " +
                        "Check your email or phone.");
        response.put("email", user.getEmail());
        // Remove in production - only for testing
        response.put("otp", otp);

        return ResponseEntity.ok(response);
    }

    // Verify OTP
    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");
        Map<String, String> response = new HashMap<>();

        String storedOtp = otpStore.get(email);

        if (storedOtp == null) {
            response.put("message",
                    "OTP expired! Please request a new one.");
            return ResponseEntity.badRequest().body(response);
        }

        if (!storedOtp.equals(otp)) {
            response.put("message", "Invalid OTP!");
            return ResponseEntity.badRequest().body(response);
        }

        response.put("message", "OTP verified successfully!");
        response.put("verified", "true");
        return ResponseEntity.ok(response);
    }

    // Reset password
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");
        Map<String, String> response = new HashMap<>();

        // Verify OTP again for security
        String storedOtp = otpStore.get(email);
        if (storedOtp == null || !storedOtp.equals(otp)) {
            response.put("message",
                    "Invalid or expired OTP!");
            return ResponseEntity.badRequest().body(response);
        }

        // Validate new password
        if (newPassword == null || newPassword.length() < 6) {
            response.put("message",
                    "Password must be at least 6 characters!");
            return ResponseEntity.badRequest().body(response);
        }

        // Find user and update password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );
        userRepository.save(user);

        // Remove OTP after successful reset
        otpStore.remove(email);

        response.put("message",
                "Password reset successfully! " +
                        "Please login with your new password.");
        return ResponseEntity.ok(response);
    }
}