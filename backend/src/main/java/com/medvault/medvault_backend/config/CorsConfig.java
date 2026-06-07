package com.medvault.medvault_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // Allow requests from React frontend
        corsConfiguration.addAllowedOrigin("http://localhost:3000");

        // Allow all HTTP methods
        corsConfiguration.addAllowedMethod("*");

        // Allow all headers including Authorization
        corsConfiguration.addAllowedHeader("*");

        // Allow Authorization header to be sent
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // Apply to all endpoints
        source.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(source);
    }
}