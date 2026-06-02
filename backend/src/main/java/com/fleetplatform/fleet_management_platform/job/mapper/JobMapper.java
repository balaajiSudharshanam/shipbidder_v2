package com.fleetplatform.fleet_management_platform.job.mapper;

import com.fleetplatform.fleet_management_platform.job.api.JobResponse;
import com.fleetplatform.fleet_management_platform.job.domain.Job;
import com.fleetplatform.fleet_management_platform.location.mapper.LocationMapper;
import com.fleetplatform.fleet_management_platform.shipment.mapper.ShipmentMapper;

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
                LocationMapper.toResponse(job.getPickup()),
                LocationMapper.toResponse(job.getDropoff()),
                ShipmentMapper.toResponse(job.getShipment()),
                job.getCreatedAt()
        );
    }
}
