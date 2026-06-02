package com.fleetplatform.fleet_management_platform.location.api;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LocationResponse {
    private Long id;
    private Double lat;
    private Double lng;
    private String address;
}
