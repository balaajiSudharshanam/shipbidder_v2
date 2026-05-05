package com.fleetplatform.fleet_management_platform.auth.application;

public record LoginResult(String token, boolean requiresOnboarding) {}
