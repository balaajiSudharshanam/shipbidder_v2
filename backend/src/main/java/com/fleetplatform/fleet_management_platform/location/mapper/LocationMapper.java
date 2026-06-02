package com.fleetplatform.fleet_management_platform.location.mapper;

import com.fleetplatform.fleet_management_platform.location.api.LocationResponse;
import com.fleetplatform.fleet_management_platform.location.domain.Location;

public class LocationMapper {

    private LocationMapper() {}

    public static LocationResponse toResponse(Location location) {
        return new LocationResponse(
                location.getId(),
                location.getLat(),
                location.getLng(),
                location.getAddress()
        );
    }
}
