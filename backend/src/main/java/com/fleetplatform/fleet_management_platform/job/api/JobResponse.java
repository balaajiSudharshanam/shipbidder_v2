package com.fleetplatform.fleet_management_platform.job.api;

import com.fleetplatform.fleet_management_platform.job.domain.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String posterEmail;
    private String posterName;
    private JobStatus status;
    private BigDecimal budgetCeiling;
    private LocalDateTime auctionClosesAt;
    private LocationResponse pickup;
    private LocationResponse dropoff;
    private ShipmentResponse shipment;
    private LocalDateTime createdAt;
}
