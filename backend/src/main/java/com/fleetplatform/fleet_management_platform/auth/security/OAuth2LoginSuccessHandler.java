package com.fleetplatform.fleet_management_platform.auth.security;


import com.fleetplatform.fleet_management_platform.auth.application.OnboardingTokenService;
import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import com.fleetplatform.fleet_management_platform.user.domain.UserRepository;
import com.fleetplatform.fleet_management_platform.user.domain.UserRole;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final OnboardingTokenService onboardingTokenService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OidcUser oidcUser = (OidcUser) authentication.getPrincipal();

        String email = oidcUser.getEmail();
        String name = oidcUser.getFullName();
        String providerId = oidcUser.getSubject();

        User savedUser=userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .name(name)
                    .provider("GOOGLE")
                    .providerId(providerId)
                    .role(UserRole.UNASSIGNED)
                    .createdAt(LocalDateTime.now())
                    .build();

            return userRepository.save(user);

        });

        if (savedUser.getRole() == UserRole.UNASSIGNED) {
            String token = onboardingTokenService.generateToken(savedUser);

            Cookie onboardingCookie = new Cookie("onboarding_token", token);
            onboardingCookie.setHttpOnly(true);
            onboardingCookie.setSecure(false);
            onboardingCookie.setPath("/");
            onboardingCookie.setMaxAge(10 * 60);
            response.addCookie(onboardingCookie);

            response.sendRedirect(frontendUrl + "/select-role");
            return;
        }

        response.sendRedirect(frontendUrl + "/");
    }
}
