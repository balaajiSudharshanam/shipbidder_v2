package com.fleetplatform.fleet_management_platform.common;

public class ApiRoutes {

    public static class Auth {
        public static final String BASE = "/api/auth";
        public static final String REGISTER = "/register";
        public static final String LOGIN = "/login";
        public static final String LOGIN_SUCCESS = "/login-success";
    }

    public static class User {
        public static final String BASE = "/api/user";
        public static final String ME = "/me";
        public static final String UPDATE_ROLE = "/update-role";
    }

    public static class Job {
        public static final String BASE = "/api/jobs";
        public static final String BY_ID = "/{id}";
        public static final String MY = "/my";
    }
}