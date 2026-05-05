package com.fleetplatform.fleet_management_platform.job.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class LocationRequest {

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @NotNull
    private Double lat;

    @NotNull
    private Double lng;
}
