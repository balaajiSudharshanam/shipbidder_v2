package com.fleetplatform.fleet_management_platform.job.api;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LocationResponse {
    private String address;
    private String city;
    private Double lat;
    private Double lng;
}
