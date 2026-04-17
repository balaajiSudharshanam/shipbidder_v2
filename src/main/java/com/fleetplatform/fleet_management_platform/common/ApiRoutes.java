package com.fleetplatform.fleet_management_platform.common;

public class ApiRoutes {

    public static class User {
        public static final String BASE = "/api/user";
        public static final String ME = "/me";
        public static final String UPDATE_ROLE = "/update-role";
    }

    public static class Auth {
        public static final String BASE = "/api/auth";
        public static final String ME = "/me";
        public static final String AUTH_SUCESS="/api/public/login-success";
    }
}