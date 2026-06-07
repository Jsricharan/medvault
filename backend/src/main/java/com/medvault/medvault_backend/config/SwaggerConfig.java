package com.medvault.medvault_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI medVaultOpenAPI() {

        // JWT Security Scheme
        SecurityScheme securityScheme =
                new SecurityScheme()
                        .name("Bearer Authentication")
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description(
                                "Enter your JWT token. " +
                                        "Get it from /api/auth/login"
                        );

        // Security Requirement
        SecurityRequirement securityRequirement =
                new SecurityRequirement()
                        .addList("Bearer Authentication");

        // API Info
        Info info = new Info()
                .title("MedVault API")
                .version("1.0.0")
                .description(
                        "## MedVault Healthcare Management System\n\n" +
                                "### Overview\n" +
                                "MedVault is a complete healthcare management " +
                                "platform with appointment booking, " +
                                "medical records, and notifications.\n\n" +
                                "### Roles\n" +
                                "- **PATIENT** — Book appointments, " +
                                "view medical records\n" +
                                "- **DOCTOR** — Manage appointments, " +
                                "create medical records\n" +
                                "- **ADMIN** — Full system access\n\n" +
                                "### Authentication\n" +
                                "1. Register at `/api/auth/register`\n" +
                                "2. Login at `/api/auth/login`\n" +
                                "3. Copy the token from response\n" +
                                "4. Click **Authorize** button above\n" +
                                "5. Enter: `your-token-here`\n\n" +
                                "### Base URL\n" +
                                "`http://localhost:8080`"
                )
                .contact(new Contact()
                        .name("MedVault Team")
                        .email("admin@medvault.com")
                )
                .license(new License()
                        .name("MIT License")
                );

        // Server
        Server localServer = new Server()
                .url("http://localhost:8080")
                .description("Local Development Server");

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer))
                .components(new Components()
                        .addSecuritySchemes(
                                "Bearer Authentication",
                                securityScheme
                        )
                )
                .addSecurityItem(securityRequirement);
    }
}