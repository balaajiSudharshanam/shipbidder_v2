package com.fleetplatform.fleet_management_platform.auth.api;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AuthController {

    @GetMapping(ApiRoutes.Auth.AUTH_SUCESS)
    public Map<String, String> loginSuccess() {
        return Map.of("message", "OAuth login success");
    }
}