package com.fleetplatform.fleet_management_platform.location.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByLatAndLng(Double lat, Double lng);
}
