package com.fleetplatform.fleet_management_platform.auth.application;

import com.fleetplatform.fleet_management_platform.user.domain.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class OnboardingTokenService {

    @Value("${app.jwt.onboarding-secret}")
    private String onboardingSecret;

    @Value("${app.jwt.onboarding-expiration-ms}")
    private long onboardingExpirationMs;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(onboardingSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + onboardingExpirationMs);

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("email", user.getEmail())
                .claim("purpose", "ROLE_SELECTION")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    public Long extractUserId(String token) {
        Claims claims = parseClaims(token);
        validatePurpose(claims);
        return Long.valueOf(claims.getSubject());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private void validatePurpose(Claims claims) {
        String purpose = claims.get("purpose", String.class);
        if (!"ROLE_SELECTION".equals(purpose)) {
            throw new RuntimeException("Invalid onboarding token purpose");
        }
    }
}