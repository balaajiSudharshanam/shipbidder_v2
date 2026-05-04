package com.fleetplatform.fleet_management_platform.user.application;

import com.fleetplatform.fleet_management_platform.auth.application.OnboardingTokenService;
import com.fleetplatform.fleet_management_platform.common.exception.BadRequestException;
import com.fleetplatform.fleet_management_platform.common.exception.ConflictException;
import com.fleetplatform.fleet_management_platform.common.exception.UnauthorizedException;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import com.fleetplatform.fleet_management_platform.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OnboardingTokenService onboardingTokenService;

    public UserRole updateRole(String onboardingToken, String role) {
        if (onboardingToken == null || onboardingToken.isBlank()) {
            throw new UnauthorizedException("Missing onboarding token");
        }

        Long userId = onboardingTokenService.extractUserId(onboardingToken);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (user.getRole() != UserRole.UNASSIGNED) {
            throw new ConflictException("Role already assigned");
        }

        UserRole newRole = parseRole(role);

        if (newRole == UserRole.UNASSIGNED) {
            throw new BadRequestException("Cannot assign UNASSIGNED role");
        }

        user.setRole(newRole);
        userRepository.save(user);

        return newRole;

    }

    private String extractBearerToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        return authorizationHeader.substring(7);
    }

    private UserRole parseRole(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid role: " + role);
        }
    }
}