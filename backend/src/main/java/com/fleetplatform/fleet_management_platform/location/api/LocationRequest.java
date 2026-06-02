package com.fleetplatform.fleet_management_platform.location.api;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class LocationRequest {

    @NotNull
    private Double lat;

    @NotNull
    private Double lng;

    private String address;
}
