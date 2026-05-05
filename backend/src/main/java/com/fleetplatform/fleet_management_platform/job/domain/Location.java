package com.fleetplatform.fleet_management_platform.job.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    private String address;
    private String city;
    private Double lat;
    private Double lng;
}
