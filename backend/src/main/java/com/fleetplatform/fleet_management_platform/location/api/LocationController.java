package com.fleetplatform.fleet_management_platform.location.api;

import com.fleetplatform.fleet_management_platform.common.ApiRoutes;
import com.fleetplatform.fleet_management_platform.location.application.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiRoutes.Location.BASE)
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LocationResponse save(@Valid @RequestBody LocationRequest request) {
        return locationService.save(request.getLat(), request.getLng(), request.getAddress());
    }

    @GetMapping
    public List<LocationResponse> getAll() {
        return locationService.getAll();
    }
}
