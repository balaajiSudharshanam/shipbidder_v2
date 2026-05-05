package com.fleetplatform.fleet_management_platform.user.api;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.user.application.UserService;
import com.fleetplatform.fleet_management_platform.user.domain.UserRole;
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
        UserRole updatedRole = userService.updateRole(onboardingToken, request.getRole());

        Cookie clearCookie = new Cookie("onboarding_token", null);
        clearCookie.setHttpOnly(true);
        clearCookie.setPath("/");
        clearCookie.setMaxAge(0);
        response.addCookie(clearCookie);

        return new RoleResponse("Role updated successfully", updatedRole.name());
    }
}
