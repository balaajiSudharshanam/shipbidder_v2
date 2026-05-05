package com.fleetplatform.fleet_management_platform.job.mapper;

import com.fleetplatform.fleet_management_platform.job.api.JobResponse;
import com.fleetplatform.fleet_management_platform.job.api.LocationResponse;
import com.fleetplatform.fleet_management_platform.job.api.ShipmentResponse;
import com.fleetplatform.fleet_management_platform.job.domain.Job;
import com.fleetplatform.fleet_management_platform.job.domain.Location;
import com.fleetplatform.fleet_management_platform.job.domain.Shipment;

public class JobMapper {

    private JobMapper() {}

    public static JobResponse toResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getPoster().getEmail(),
                job.getPoster().getName(),
                job.getStatus(),
                job.getBudgetCeiling(),
                job.getAuctionClosesAt(),
                toLocationResponse(job.getPickup()),
                toLocationResponse(job.getDropoff()),
                toShipmentResponse(job.getShipment()),
                job.getCreatedAt()
        );
    }

    private static LocationResponse toLocationResponse(Location loc) {
        return new LocationResponse(loc.getAddress(), loc.getCity(), loc.getLat(), loc.getLng());
    }

    private static ShipmentResponse toShipmentResponse(Shipment s) {
        return new ShipmentResponse(
                s.getId(),
                s.getWeightKg(),
                s.getLengthCm(),
                s.getWidthCm(),
                s.getHeightCm(),
                s.getCargoType(),
                s.getFragile(),
                s.getStackable(),
                s.getSpecialInstructions()
        );
    }
}
