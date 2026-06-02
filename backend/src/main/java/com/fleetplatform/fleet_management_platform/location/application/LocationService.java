package com.fleetplatform.fleet_management_platform.location.application;

import com.fleetplatform.fleet_management_platform.location.api.LocationResponse;
import com.fleetplatform.fleet_management_platform.location.domain.Location;
import com.fleetplatform.fleet_management_platform.location.domain.LocationRepository;
import com.fleetplatform.fleet_management_platform.location.mapper.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    @Transactional
    public LocationResponse save(Double lat, Double lng, String address) {
        Location location = locationRepository.save(
                Location.builder().lat(lat).lng(lng).address(address).build()
        );
        return LocationMapper.toResponse(location);
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getAll() {
        return locationRepository.findAll().stream()
                .map(LocationMapper::toResponse)
                .toList();
    }
}
