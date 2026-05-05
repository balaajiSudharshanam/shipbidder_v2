package com.fleetplatform.fleet_management_platform.auth.api;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private String message;
    private String status;
    private String role;
}
