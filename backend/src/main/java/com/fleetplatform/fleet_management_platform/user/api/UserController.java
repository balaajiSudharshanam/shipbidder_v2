package com.fleetplatform.fleet_management_platform.user.api;

import com.fleetplatform.fleet_management_platform.auth.application.JwtService;
import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.user.application.UserService;
import com.fleetplatform.fleet_management_platform.user.domain.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(ApiRoutes.User.BASE)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @GetMapping(ApiRoutes.User.ME)
    public UserResponse getMe(Principal principal) {
        return userService.getMe(principal.getName());
    }

    @PostMapping(ApiRoutes.User.UPDATE_ROLE)
    public RoleResponse updateRole(
            @CookieValue(name = "onboarding_token", required = false) String onboardingToken,
            @RequestBody UpdateRoleRequest request,
            HttpServletResponse response
    ) {
        User user = userService.updateRole(onboardingToken, request.getRole());

        Cookie clear = new Cookie("onboarding_token", "");
        clear.setHttpOnly(true);
        clear.setPath("/");
        clear.setMaxAge(0);
        response.addCookie(clear);

        Cookie authCookie = new Cookie("auth_token", jwtService.generateToken(user));
        authCookie.setHttpOnly(true);
        authCookie.setSecure(false);
        authCookie.setPath("/");
        authCookie.setMaxAge(24 * 60 * 60);
        response.addCookie(authCookie);

        return new RoleResponse("Role updated successfully", user.getRole().name());
    }
}
