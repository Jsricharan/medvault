package com.medvault.medvault_backend.controller;

import com.medvault.medvault_backend.dto.AuthResponse;
import com.medvault.medvault_backend.dto.LoginRequest;
import com.medvault.medvault_backend.dto.RegisterRequest;
import com.medvault.medvault_backend.repository.UserRepository;
import com.medvault.medvault_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(
        name = "Authentication",
        description = "APIs for user registration, " +
                "login and password management"
)
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Operation(
            summary = "Register a new user",
            description = "Creates a new account for " +
                    "Patient, Doctor or Admin"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Registration successful"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Email already exists or " +
                            "invalid data"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest request) {
        AuthResponse response =
                authService.register(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Login user",
            description = "Authenticates user and " +
                    "returns JWT token"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful — " +
                            "returns JWT token"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid email or password"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {
        AuthResponse response =
                authService.login(request);
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Check email availability",
            description = "Checks if email is already " +
                    "registered in the system"
    )
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>>
    checkEmail(
            @RequestParam String email) {

        Map<String, Object> response = new HashMap<>();
        boolean exists = userRepository
                .existsByEmail(
                        email.trim().toLowerCase()
                );
        response.put("exists", exists);
        response.put("available", !exists);
        response.put("message", exists
                ? "Email already registered!"
                : "Email is available!"
        );
        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Get current user info",
            description = "Returns token info for " +
                    "authenticated user"
    )
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader("Authorization")
            String authHeader) {
        return ResponseEntity.ok(
                "Token received: " + authHeader
        );
    }
}