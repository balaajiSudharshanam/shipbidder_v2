package com.fleetplatform.fleet_management_platform.auth.api;

import com.fleetplatform.fleet_management_platform.auth.application.AuthService;
import com.fleetplatform.fleet_management_platform.auth.application.LoginResult;
import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.Auth.BASE)
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping(ApiRoutes.Auth.REGISTER)
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        String token = authService.register(request.getEmail(), request.getPassword(), request.getName());

        Cookie cookie = new Cookie("onboarding_token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(10 * 60);
        response.addCookie(cookie);

        return new RegisterResponse("Registration successful. Please select your role.");
    }

    @PostMapping(ApiRoutes.Auth.LOGIN)
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResult result = authService.login(request.getEmail(), request.getPassword());

        Cookie cookie;
        if (result.requiresOnboarding()) {
            cookie = new Cookie("onboarding_token", result.token());
            cookie.setMaxAge(10 * 60);
        } else {
            cookie = new Cookie("auth_token", result.token());
            cookie.setMaxAge(24 * 60 * 60);
        }
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        response.addCookie(cookie);

        return result.requiresOnboarding()
                ? new LoginResponse("Please complete your profile.", "ONBOARDING_REQUIRED", null)
                : new LoginResponse("Login successful.", "SUCCESS", result.role());
    }

    @GetMapping(ApiRoutes.Auth.LOGIN_SUCCESS)
    public Map<String, String> loginSuccess() {
        return Map.of("message", "OAuth login success");
    }
}
