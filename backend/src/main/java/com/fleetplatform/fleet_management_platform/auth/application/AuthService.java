package com.fleetplatform.fleet_management_platform.auth.application;

import com.fleetplatform.fleet_management_platform.common.exception.ConflictException;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import com.fleetplatform.fleet_management_platform.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OnboardingTokenService onboardingTokenService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public String register(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("Email already registered");
        }

        User user = User.builder()
                .email(email)
                .name(name)
                .password(passwordEncoder.encode(password))
                .provider("LOCAL")
                .role(UserRole.UNASSIGNED)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return onboardingTokenService.generateToken(user);
    }
}
